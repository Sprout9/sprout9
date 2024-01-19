# Sprout 9 Public Repository


#### Update forms app container image
Tag a commit with changes to `./forms` with `v*.*.*` to start the workflow that will update the container image in DockerHub with tags `latest`, `v*.*.*` and `v*.*`.

#### Update nginx app container image
Any commit with changes to `./nginx` will update the container image in DockerHub with tag `nginx-latest`.

#### Deploying
The workflow will always run to check if the latest container image is running and update accordingly.