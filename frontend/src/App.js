import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lookupTopics, initialNews, updateTopic } from './actions';
import { selectTopics } from './selectors'
import './App.css';
import { Topics } from './components/Topics';
import { News } from './components/News'
import { socket } from './socket';

const App = () => {

  const dispatch = useDispatch();

  const sendNotification = (title, body) => {
    const notification = new Notification(title, { body });

    console.log(":D")
  }

  useEffect(() => {
    console.log(Notification.permission);

    socket.emit("lookup_topics", {});

    socket.on("lookup_topics", (resp) => {
      socket.off("lookup_topics")
      dispatch(lookupTopics(resp))
    })

    socket.on("initial_news", (resp) => {
      dispatch(initialNews(resp.topic, resp.news_update))
    });

    socket.on("topic_update", (resp) => {
      sendNotification(`${resp.news_update.length} news on ${resp.topic}`)
      dispatch(updateTopic(resp.topic, resp.news_update))
    })
  }, [])

  return (
    <div className="app">
      <Topics />
      <News />
    </div>
  );
}

export default App;
