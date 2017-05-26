#!/bin/bash

# Show command before executing
set -x

# Exit on error
set -e

# Source environment variables of the jenkins slave
# that might interest this worker.
if [ -e "jenkins-env" ]; then
  cat jenkins-env \
    | grep -E "(JENKINS_URL|GIT_BRANCH|GIT_COMMIT|BUILD_NUMBER|ghprbSourceBranch|ghprbActualCommit|BUILD_URL|ghprbPullId)=" \
    | sed 's/^/export /g' \
    > /tmp/jenkins-env
  source /tmp/jenkins-env
fi

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install docker make git
service docker start

# Build builder image
cp /tmp/jenkins-env .
docker build -t fabric8-planner-builder -f deploy/Dockerfile.builder .
mkdir -p runtime/dist && docker run --detach=true --name=fabric8-planner-builder --user=root --cap-add=SYS_ADMIN -t -v $(pwd)/runtime/dist:/dist:Z fabric8-planner-builder

docker exec fabric8-planner-builder npm install

docker exec fabric8-planner-builder npm run test:unit

docker exec fabric8-planner-builder npm run build

docker exec  -i fabric8-planner-builder bash -c "cd runtime ; npm install"

docker exec fabric8-planner-builder bash -c "cd runtime ; npm run test:funcsmoke"

docker exec  -i fabric8-planner-builder bash -c "cd runtime ; npm run build"

# Rest of it should be removed since there is no production from the registry
# Let's discuss
docker exec -u root fabric8-planner-builder cp -r /home/fabric8/fabric8-planner/runtime/dist /

## All ok, deploy
docker build -t almighty-ui-deploy -f deploy/Dockerfile.deploy .

TAG=$(echo $GIT_COMMIT | cut -c1-6)

docker tag almighty-ui-deploy registry.devshift.net/almighty/almighty-ui:$TAG
docker push registry.devshift.net/almighty/almighty-ui:$TAG

docker tag almighty-ui-deploy registry.devshift.net/almighty/almighty-ui:latest
docker push registry.devshift.net/almighty/almighty-ui:latest
