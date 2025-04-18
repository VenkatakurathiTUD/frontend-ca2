pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/VenkatakurathiTUD/frontend-ca2.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh '/opt/homebrew/bin/npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh '/opt/homebrew/bin/npm test'
            }
        }
        stage('Build Application') {
            steps {
                sh '/opt/homebrew/bin/npm run build'
            }
        }
    }
}
