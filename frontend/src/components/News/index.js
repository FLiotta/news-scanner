import cn from 'classnames'
import { useSelector } from 'react-redux';
import { selectActiveTopic } from '../../selectors';

import './styles.css'

export const News = () => {
  const activeTopic = useSelector(selectActiveTopic);

  return (
    <div id="news">
      {activeTopic?.news.map((_new) => (
        <a href={_new.href} target='_blank'>
          <div className={cn('new rounded-md cursor-pointer', {
            "new-unseen": !_new.seen
          })}>
            <div>
              <h3><b>{_new.title}</b></h3>
              <p>{_new.description}</p>
              <small>{_new.hour}</small>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}