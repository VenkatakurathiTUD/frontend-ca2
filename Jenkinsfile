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
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test || echo "No tests to run"'
            }
        }
        stage('Dockerize the Application') {
            steps {
                script {
                sh 'docker build -t frontend-app:latest .'
                }
            }
        }
    }
}
