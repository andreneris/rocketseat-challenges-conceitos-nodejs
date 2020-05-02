const express = require("express");
const cors = require("cors");

const { uuid,isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function idCheck(req,res,next){
  const {id} = req.params;
  if (!isUuid(id)){
    return res.status(400).json({error:"Invalid repository id"});
  }

  const repositoryIndex = repositories.findIndex(repo=>repo.id===id);
  if (repositoryIndex<0){
    return res.status(400).json({error:"Repository Id not found"});
  }

  req.body.repositoryIndex = repositoryIndex;
  return next();
}

app.use('/repositories/:id', idCheck);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0
  }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {repositoryIndex,title,url,techs} = request.body;
  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;
  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const {repositoryIndex} = request.body;
  repositories.splice(repositoryIndex, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex } = request.body;
  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
