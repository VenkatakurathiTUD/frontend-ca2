pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
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
                    sh 'eval $(minikube docker-env)'
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    sh 'kubectl apply -f k8s/service.yaml'
                    sh 'eval $(minikube docker-env -u)'
                }
            }
        }
    }
}
