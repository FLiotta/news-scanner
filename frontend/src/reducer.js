import { TOPIC_UPDATE, INITIAL_NEWS, ADD_TOPIC, SELECT_TOPIC, REMOVE_TOPIC, LOOKUP_TOPIC, SEEN_TOPIC } from "./actions";

const defaultState = {
  topics: [],
  activeTopic: null,
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case ADD_TOPIC:
      var topicExists = state.topics.find((t) => t.name == action.payload.name);

      if(topicExists) {
        return state
      }

      const topic = {
        awaitingInitialNews: true,
        seen: false,
        name: action.payload.name,
        news: []
      }


      return {
        ...state,
        topics: [...state.topics, topic]
      }
    case REMOVE_TOPIC:
      var topicExists = state.topics.find((t) => t.name == action.payload.name);

      if(!topicExists) {
        return state
      }

      return {
        activeTopic: action.payload.name == state.activeTopic ? null: state.activeTopic,
        topics: state.topics.filter((topic) => topic.name != action.payload.name)
      }
    case INITIAL_NEWS:
      var topicExists = state.topics.find((t) => t.name == action.payload.topic);

      if(!topicExists) {
        return state
      }

      var updatedNews = action.payload.news.map((_new) => ({..._new, seen: false}));

      return {
        ...state,
        topics: state.topics.map((topic) => {
          if(topic.name != action.payload.topic) {
            return topic
          }
  
          return {
            ...topic,
            awaitingInitialNews: false,
            news: updatedNews
          }
        })
      }
    case TOPIC_UPDATE:
      var topicExists = state.topics.find((t) => t.name == action.payload.topic);

      if(!topicExists) {
        return state
      }

      var updatedNews = action.payload.news.map((_new) => ({..._new, seen: false}));

      return {
        ...state,
        topics: state.topics.map((topic) => {
          if(topic.name != action.payload.topic) {
            return topic
          }
  
          return {
            ...topic,
            seen: false,
            news: [...updatedNews, ...topic.news]
          }
        })
      }
    case SELECT_TOPIC:
      var topicExists = state.topics.find((t) => t.name == action.payload.topic);

      if(!topicExists) {
        return state
      }

      return {
        activeTopic: action.payload.topic,
        topics: state.topics.map((topic) => {
          if(topic.name != action.payload.topic) {
            return topic
          }
  
          return {
            ...topic,
            seen: true,
          }
        })
      }
    case LOOKUP_TOPIC:
      const topics = Object.keys(action.payload);
      const parsedTopics = []

      
      if(!topics.length) {
        return {
          activeTopic: null,
          topics: []
        }
      }

      topics.forEach(topic_name => {
        const topic = action.payload[topic_name];
        
        const news = topic.news.map((_new) => ({..._new, seen: true}));
          
        parsedTopics.push({
          awaitingInitialNews: false,
          seen: false,
          name: topic_name,
          news
        })
      })
      
      return {
        activeTopic: null,
        topics: parsedTopics
      }
    case SEEN_TOPIC:
      return {
        ...state,
        topics: state.topics.map((topic) => {
          if (topic.name != action.payload) {
            return topic
          }

          return {
            ...topic,
            news: topic.news.map((_new) => ({..._new, seen: true}))
          }
        })
      }
    default:
      return state;
  }
}