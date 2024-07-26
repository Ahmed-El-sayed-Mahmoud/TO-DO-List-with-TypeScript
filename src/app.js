"use strict";
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class ProjectState {
    constructor() {
        this.Listeners = [];
    }
    addProject(title, description, num, status) {
        const newProject = {
            id: Math.random().toString(),
            title,
            description,
            peopleNum: num,
            status: status
        };
        ProjectState.project_list.push(newProject);
        this.Listeners.map((val, index) => {
            val(ProjectState.project_list.slice());
        });
    }
    static getInstance() {
        if (!ProjectState.instance) {
            ProjectState.instance = new ProjectState();
            return ProjectState.instance;
        }
        return ProjectState.instance;
    }
    addListener(func) {
        this.Listeners.push(func);
    }
}
ProjectState.project_list = [];
const project_state = ProjectState.getInstance();
class ProjectList {
    constructor(type) {
        this.type = type;
        this.assignedProjects = [];
        this.HostElement = document.getElementById("app");
        this.TemplateElement = document.getElementById("project-list");
        const TemplateNode = document.importNode(this.TemplateElement.content, true);
        this.Element = TemplateNode.firstElementChild;
        console.log(this.Element);
        this.HostElement.insertAdjacentElement("beforeend", this.Element);
        this.configure();
        this.assignProjects();
    }
    configure() {
        this.Element.querySelector("h2").textContent = `${(this.type === ProjectStatus.Active ? "active" : "finished").toUpperCase()} PROJECTS`;
        this.Element.querySelector("ul").id = `${this.type === ProjectStatus.Active ? "active" : "finished"}-projects-list`;
        this.Element.querySelector("header").id = `${this.type === ProjectStatus.Active ? "active" : "finished"}-projects`;
    }
    assignProjects() {
        project_state.addListener((list) => {
            this.assignedProjects = list;
            this.renderProjects();
        });
    }
    renderProjects() {
        console.log("assigned projects: ", this.assignedProjects);
        // Clear existing project lists
        const ProjectsList = this.Element.querySelector(`#${this.type === ProjectStatus.Active ? "active" : "finished"}-projects-list`);
        ProjectsList.textContent = "";
        this.assignedProjects.forEach((val) => {
            const state = val.status === ProjectStatus.Active ? "active" : "finished";
            console.log(`${state}-projects-list`);
            const ul_Element = this.Element.querySelector(`#${state}-projects-list`);
            if (ul_Element) {
                const projectElement = document.createElement("li");
                projectElement.innerHTML = `<p>${val.title}</p>`;
                ul_Element.insertAdjacentElement("beforeend", projectElement);
            }
            else {
                console.warn(`No element found for state: ${state}`);
            }
        });
    }
}
function Validate(obj) {
    const val = obj.value;
    let result = true;
    if (obj.Required)
        result = result && val.toString().trim().length !== 0;
    if (obj.MaxLength && typeof val === "string")
        result = result && val.toString().length < obj.MaxLength;
    if (obj.MinLength && typeof val === "string")
        result = result && val.toString().length > obj.MinLength;
    return result;
}
class FormInput {
    constructor() {
        this.HostElement = document.getElementById("app");
        this.TemplateElement = document.getElementById("project-input");
        const TemplateNode = document.importNode(this.TemplateElement.content, true);
        this.Element = TemplateNode.firstElementChild;
        this.Element.id = "user-input";
        this.TitleElement = this.Element.querySelector("#Input_title");
        this.DescriptionElement = this.Element.querySelector("#description");
        this.NumElement = this.Element.querySelector("#people");
        this.HostElement.insertAdjacentElement("afterbegin", this.Element);
        this.Configure();
    }
    SubmitHandlerEvent(event) {
        event.preventDefault();
        if (!Validate({
            value: this.TitleElement.value,
            Required: true,
            MinLength: 5,
        }) ||
            !Validate({ value: this.DescriptionElement.value, Required: true }) ||
            !Validate({ value: this.NumElement.value, Required: false })) {
            alert("Fill all fields");
        }
        else {
            project_state.addProject(this.TitleElement.value, this.DescriptionElement.value, Number(this.NumElement.value), ProjectStatus.Finished);
            this.DescriptionElement.value = "";
            this.NumElement.value = "";
            this.TitleElement.value = "";
        }
    }
    Configure() {
        this.Element.addEventListener("submit", this.SubmitHandlerEvent.bind(this));
    }
}
const projectList = new ProjectList(ProjectStatus.Finished);
const projectist = new ProjectList(ProjectStatus.Active);
const formInput = new FormInput();
//# sourceMappingURL=app.js.map