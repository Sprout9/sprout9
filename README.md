# Sprout 9 Public Repository
This repository holds the code for the website [Sprout9.nl](https://www.sprout9.nl/).

Send an email to [info@sprout9.nl](mailto:info@sprout9.nl) for any questions.

## Contents

- Sprout9 Forms App (see [Live](https://forms.sprout9.nl/))
- Terraform code
- Ansible code
- Nginx configuration

## Quickstart
Please ensure docker is running.
To run forms locally:
```bash
# run mongodb locally in docker:
docker run -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=... -e MONGO_INITDB_ROOT_PASSWORD=... mongodb -d
git clone https://github.com/Sprout9/sprout9.git
cd forms
cp .env.example .env
# fill in .env
npm run dev
```
then visit http://localhost:3000


## Updating
These are the different updating workflows
- `.github/workflows/infrastructure.yaml`
  
  Updates AWS resources
- `.github/workflows/nginx.yaml`

  Updates Nginx container image
- `.github/workflows/forms-deployment.yaml`

  Updates Forms App container image and deploys apps

### Terraform, Ansible
Update by pushing to main branch.

### Forms App
To update, push a new git tag to github. This will start the forms app update workflow (workflow-tags).
```bash
git tag -a v*.*.* -m "tag label"
git push --tags
```
A commit with tag `v*.*.*` will update the container image in DockerHub with tags `latest`, `v*.*.*` and `v*.*`.

### Update nginx app container image
Any commit with changes to `./nginx` will update the container image in DockerHub with tag `nginx-latest`.

### Deploying
The forms app workflow will always run to check if the latest container image is running and update accordingly.