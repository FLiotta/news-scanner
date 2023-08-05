export const selectTopics = (state) => state.topics;

export const selectActiveTopic = (state) => {
  const activeTopic = state.activeTopic;

  return state.topics.find((topic) => topic.name == activeTopic);
}