pipeline {
    agent any

    environment {
        AWS_REGION   = 'ap-southeast-2'
        ECR_REGISTRY = '953334886363.dkr.ecr.ap-southeast-2.amazonaws.com'
        IMAGE_TAG    = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh '''
                    cd docker
                    DOCKER_BUILDKIT=0 docker-compose build
                '''
            }
        }

        stage('Test Services') {
            steps {
                echo 'Testing health endpoints...'
                sh '''
                    cd docker
                    DOCKER_BUILDKIT=0 docker-compose up -d
                    sleep 20
                    curl -f http://localhost:8081/health || exit 1
                    curl -f http://localhost:8082/health || exit 1
                    curl -f http://localhost:8083/health || exit 1
                    curl -f http://localhost:8084/health || exit 1
                    echo "All health checks passed"
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                echo 'Pushing images to ECR...'
                sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                      docker login --username AWS \
                      --password-stdin $ECR_REGISTRY

                    for service in auth-service account-service txn-service loan-service; do
                        docker tag docker-$service:latest $ECR_REGISTRY/sbs/$service:$IMAGE_TAG
                        docker tag docker-$service:latest $ECR_REGISTRY/sbs/$service:latest
                        docker push $ECR_REGISTRY/sbs/$service:$IMAGE_TAG
                        docker push $ECR_REGISTRY/sbs/$service:latest
                        echo "$service pushed to ECR"
                    done
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh '''
                    cd docker
                    DOCKER_BUILDKIT=0 docker-compose up -d
                    sleep 10
                    curl -f http://localhost:8081/health || exit 1
                    echo "Deployment successful"
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
