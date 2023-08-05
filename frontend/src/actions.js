export const ADD_TOPIC = "[NEWS] ADD TOPIC"
export const REMOVE_TOPIC = "[NEWS] REMOVE TOPIC"
export const INITIAL_NEWS = "[NEWS] INITIAL NEWS"
export const TOPIC_UPDATE = "[NEWS] TOPIC UPDATE"
export const SELECT_TOPIC = "[APP] SELECT TOPIC";
export const LOOKUP_TOPIC = "[NEWS] LOOKUP TOPICS"
export const SEEN_TOPIC = "[APP] SEEN_TOPIC";

export const seenTopic = (topic_name) => ({
  type: SEEN_TOPIC,
  payload: topic_name
});

export const addTopic = (topic) => ({
  type: ADD_TOPIC,
  payload: {
    name: topic
  }
})

export const lookupTopics = (topics) => ({
  type: LOOKUP_TOPIC,
  payload: topics
})

export const removeTopic = (topic) => ({
  type: REMOVE_TOPIC,
  payload: {
    name: topic
  }
})

export const initialNews = (topic, news) => ({
  type: INITIAL_NEWS,
  payload: { topic, news }
})

export const updateTopic = (topic, news) => ({
  type: TOPIC_UPDATE,
  payload: { topic, news }
})

export const selectTopic = (topic) => ({
  type: SELECT_TOPIC,
  payload: {
    topic
  }
})