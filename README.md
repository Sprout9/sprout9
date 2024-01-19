# Sprout 9 Public Repository


#### Update forms app container image
To update the forms app, push a new git tag to github. This will start the forms app update workflow.
```bash
git tag -a v*.*.* -m "tag label"
git push --tags
```
A commit with tag `v*.*.*` will update the container image in DockerHub with tags `latest`, `v*.*.*` and `v*.*`.

#### Update nginx app container image
Any commit with changes to `./nginx` will update the container image in DockerHub with tag `nginx-latest`.

#### Deploying
The workflow will always run to check if the latest container image is running and update accordingly.