import socketio
import eventlet
from typing import TypedDict, List, Any
from helper import scrap_news, scrap_news_v2

sio = socketio.Server(async_mode='eventlet', cors_allowed_origins='*')
app = socketio.WSGIApp(sio)

AWAIT_TIME = 20

class New(TypedDict):
    id: str
    title: str
    thumbnail: str
    href: str


class Topic(TypedDict):
    last_requested_time: int
    news: List[New]


topics: dict[str, Topic] = {

}


@sio.on('track_topic')
def track_topic(sid, message):
    if message["topic"] in topics:
        return

    topic = message["topic"]
    news = scrap_news_v2(message["topic"], time="d")

    topics[topic] = {
        "last_requested_time": 0,
        "news": news
    }

    topic_update = {
        "topic": topic,
        "news_update": news
    }
    sio.emit("initial_news", topic_update)


@sio.on('untrack_topic')
def untrack_topic(sid, message):
    topic_to_delete = message["topic"]

    if message["topic"] not in topics:
        return
        
    del topics[topic_to_delete]


@sio.on('lookup_topics')
def lookup_topics(sid, message):
    print("Topic lookedup")
    sio.emit("lookup_topics", topics)


def bg_task():
    while(1):
        for topic in topics:
            print(topic)
            new_news: List[New] = scrap_news_v2(topic, time="h")
            old_news = topics[topic].get("news", [])

            old_news_ids = [old_new.get("id") for old_new in old_news]

            unseen_news = []

            for recent_new in new_news:
                if recent_new.get("id") in old_news_ids:
                    continue

                unseen_news.append(recent_new)

            topics[topic]["news"] = unseen_news + topics[topic]["news"]

            if len(unseen_news) == 0:
                print(f"Not recent news for topic {topic}", flush=True)
                continue

            topic_update = {
                "topic": topic,
                "news_update": unseen_news
            }

            sio.emit('topic_update', topic_update)

        sio.sleep(AWAIT_TIME)

def main():
    sio.start_background_task(bg_task)
    eventlet.wsgi.server(eventlet.listen(('', 8080)), app)


if __name__ == '__main__':
    main()
