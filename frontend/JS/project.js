const PARAMS = new URLSearchParams(window.location.search);
const PROJECT_ID = PARAMS.get('projectId');
const PROJECT_NAME_IN_DB = PROJECTS_ITEMS + "_" + PROJECT_ID;
var draggedTask = null;

