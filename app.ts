enum ProjectStatus{
  "Active",'Finished'
}
interface Project {
  title:string,
  id:string,
  description:string,
  status:ProjectStatus,
  peopleNum:number
}
type Listener = (items:Project[])=>void;
class ProjectState {
  static project_list: Project[] = [];
  private static instance: ProjectState;
  private Listeners: Listener[] = [];
  private constructor() {}

  addProject(title: string, description: string, num: number,status:ProjectStatus) {
    const newProject :Project = {
      id: Math.random().toString(),
      title,
      description,
     peopleNum : num,
     status:status
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
  addListener(func: Listener) {
    this.Listeners.push(func);
  }
}
const project_state = ProjectState.getInstance();
class ProjectList {
  private TemplateElement: HTMLTemplateElement;
  private HostElement: HTMLDivElement;
  private Element: HTMLElement;
  private assignedProjects: Project[] = [];
  constructor(private type: ProjectStatus)
  {
    this.HostElement = document.getElementById("app")! as HTMLDivElement;
    this.TemplateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    const TemplateNode = document.importNode(
      this.TemplateElement.content,
      true
    );
    this.Element = TemplateNode.firstElementChild! as HTMLElement;
    console.log(this.Element);
    this.HostElement.insertAdjacentElement("beforeend", this.Element);
    this.configure();
    this.assignProjects();
  }
  configure() {
    this.Element.querySelector(
      "h2"
    )!.textContent = `${(this.type===ProjectStatus.Active?"active":"finished").toUpperCase()} PROJECTS`;
    this.Element.querySelector("ul")!.id = `${this.type===ProjectStatus.Active?"active":"finished"}-projects-list`;
    this.Element.querySelector("header")!.id = `${this.type===ProjectStatus.Active?"active":"finished"}-projects`;
  }
  assignProjects() {
    project_state.addListener((list: Project[]) => {
      this.assignedProjects = list;
      this.renderProjects();
    });
  }
  renderProjects() {
    console.log("assigned projects: ", this.assignedProjects);

  // Clear existing project lists
  const ProjectsList = this.Element.querySelector(`#${this.type===ProjectStatus.Active?"active":"finished"}-projects-list`);
  
  ProjectsList!.textContent = "";
  
  this.assignedProjects.forEach((val) => {
    const state = val.status === ProjectStatus.Active ? "active" : "finished";
    console.log(`${state}-projects-list`)
    const ul_Element = this.Element.querySelector(`#${state}-projects-list`);
    if (ul_Element) {
      const projectElement = document.createElement("li");
      projectElement.innerHTML = `<p>${val.title}</p>`;
      ul_Element.insertAdjacentElement("beforeend", projectElement);
    } else {
      console.warn(`No element found for state: ${state}`);
    }
  });
  }
}

interface Validatable {
  value: string | number;
  Required?: boolean;
  MinLength?: number;
  MaxLength?: number;
}
function Validate(obj: Validatable): boolean {
  const val = obj.value;
  let result = true;
  if (obj.Required) result = result && val.toString().trim().length !== 0;
  if (obj.MaxLength && typeof val === "string")
    result = result && val.toString().length < obj.MaxLength;
  if (obj.MinLength && typeof val === "string")
    result = result && val.toString().length > obj.MinLength;
  return result;
}
class FormInput {
  private TemplateElement: HTMLTemplateElement;
  private HostElement: HTMLDivElement;
  private Element: HTMLFormElement;
  private TitleElement: HTMLInputElement;
  private DescriptionElement: HTMLInputElement;
  private NumElement: HTMLInputElement;
  constructor() {
    this.HostElement = document.getElementById("app")! as HTMLDivElement;
    this.TemplateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    const TemplateNode = document.importNode(
      this.TemplateElement.content,
      true
    );
    this.Element = TemplateNode.firstElementChild! as HTMLFormElement;
    this.Element.id = "user-input";
    this.TitleElement = this.Element.querySelector(
      "#Input_title"
    )! as HTMLInputElement;
    this.DescriptionElement = this.Element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.NumElement = this.Element.querySelector(
      "#people"
    )! as HTMLInputElement;
    this.HostElement.insertAdjacentElement("afterbegin", this.Element);
    this.Configure();
  }
  private SubmitHandlerEvent(event: Event) {
    event.preventDefault();

    if (
      !Validate({
        value: this.TitleElement.value,
        Required: true,
        MinLength: 5,
      }) ||
      !Validate({ value: this.DescriptionElement.value, Required: true }) ||
      !Validate({ value: this.NumElement.value, Required: false })
    ) {
      alert("Fill all fields");
    } else {
      project_state.addProject(
        this.TitleElement.value,
        this.DescriptionElement.value,
        Number(this.NumElement.value),
        ProjectStatus.Finished
      );
      this.DescriptionElement.value="";
      this.NumElement.value="";
      this.TitleElement.value=""
     
    }
  }
  private Configure() {
    this.Element.addEventListener("submit", this.SubmitHandlerEvent.bind(this));

  }
}
const projectList = new ProjectList(ProjectStatus.Finished);
const projectist = new ProjectList(ProjectStatus.Active);
const formInput = new FormInput();
