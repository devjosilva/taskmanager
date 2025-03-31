pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
            post {
                always {
                    junit 'reports/junit.xml'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t gestion-tareas-api:%BUILD_NUMBER% .'
                bat 'docker tag gestion-tareas-api:%BUILD_NUMBER% gestion-tareas-api:latest'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline ejecutado exitosamente!'
        }
        failure {
            echo 'El pipeline ha fallado.'
        }
        always {
            echo 'Generando reporte...'
            bat 'echo Build Number: %BUILD_NUMBER% > reports\\build-info.txt'
            bat 'echo Build Status: %currentBuild.result% >> reports\\build-info.txt'
            bat 'echo Build URL: %BUILD_URL% >> reports\\build-info.txt'
            archiveArtifacts artifacts: 'reports/*', fingerprint: true
        }
    }
}
