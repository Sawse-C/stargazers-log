const repositoryList = document.querySelector("#repository-list");
const repositoryStatus = document.querySelector("#repository-status");

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository-card";

    const link = document.createElement("a");
    link.href = repository.url;
    link.textContent = repository.full_name;

    const description = document.createElement("p");
    description.textContent = repository.description;

    const starredDate = document.createElement("time");
    starredDate.dateTime = repository.starred_at;
    starredDate.textContent = `Starred ${new Intl.DateTimeFormat(undefined, {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(`${repository.starred_at}T00:00:00Z`))}`;

    item.append(link, description, starredDate);
    repositoryList.append(item);
  }

  repositoryStatus.textContent = repositories.length
    ? ""
    : "No starred repositories to show.";
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    renderRepositories(repositories);
  } catch (error) {
    repositoryStatus.textContent = "Repositories could not be loaded. Please try again later.";
    console.error("Failed to load starred repositories:", error);
  }
}

loadRepositories();
