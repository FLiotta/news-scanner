import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveTopic, selectTopics } from '../../selectors';
import { addTopic, removeTopic } from '../../actions';

import './styles.css'
import { selectTopic, seenTopic } from '../../actions';
import Modal from '../Modal';
import { socket } from '../../socket';

export const Topics = () => {
  const dispatch = useDispatch();
  const topics = useSelector(selectTopics);
  const activeTopic = useSelector(selectActiveTopic);
  const [modalVisible, setModalVisible] = useState(false);

  const onTopicClick = (topic) => {
    if(activeTopic?.name) {
      dispatch(seenTopic(activeTopic?.name));
    }
    
    dispatch(selectTopic(topic));
  }

  const onModalSuccess = (topic) => {
    dispatch(addTopic(topic))
    const data = { 
      "topic": topic 
    };

    socket.emit("track_topic", data)
    setModalVisible(false)
  }

  const untrackTopic = (topic) => {
    dispatch(removeTopic(topic))
    const data = { 
      "topic": topic 
    };

    socket.emit("untrack_topic", data)
  }

  return (
    <>
    <Modal 
      visible={modalVisible} 
      onCancel={() => setModalVisible(false)}
      onSubmit={onModalSuccess}
      title='Track Topic'
    />
    <div className="rounded-md h-full bg-white w-1/5 flex flex-col" id="topics">
      <div className='topics__cta'>
        <button
          onClick={() => setModalVisible(true)}
          className='rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600'
        >
          Track a new topic
        </button>
      </div>
      {topics.map((topic) => (
        <div className='topic'>
          <div className='topic__info' onClick={() => onTopicClick(topic.name)}>
            {!topic?.seen && <div className='has-notifications'></div>}
            <p>{topic.name}</p>
          </div>

          <div className='topic__delete' onClick={() => untrackTopic(topic.name)}>
            <span>x</span>
          </div>
        </div>
      ))}
    </div>
  </>
  );
}