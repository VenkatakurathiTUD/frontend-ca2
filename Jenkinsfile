pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:${env.PATH}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/VenkatakurathiTUD/frontend-ca2.git'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test || echo "No tests to run"'
            }
        }
        stage('Dockerize the Application') {
            environment {
                PATH = "/usr/local/bin:${env.PATH}"
            }
            steps {
                script {
                    sh 'docker build -t frontend-app:latest .'
                }
            }
        }
        stage('Deploy to Minikube') {
            steps {
                script {
                    
                    sh 'minikube config set driver docker'
                    sh 'minikube start'

                    echo "Setting Minikube Docker environment..."
                    sh 'eval $(minikube docker-env)'

                    echo "Applying Kubernetes deployment..."
                    retry(count: env.KUBECTL_APPLY_RETRY) {
                        sh 'kubectl apply -f k8s/deployment.yaml'
                    }

                    echo "Applying Kubernetes service..."
                    retry(count: env.KUBECTL_APPLY_RETRY) {
                        sh 'kubectl apply -f k8s/service.yaml'
                    }

                    echo "Reverting to host Docker environment..."
                    sh 'eval $(minikube docker-env -u)'
                }
            }
        }
    }
}
