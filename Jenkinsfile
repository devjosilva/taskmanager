pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Docker Diagnostics') {
            steps {
                bat 'docker info'
                bat 'docker version'
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
        
        stage('Run Docker Container') {
            steps {
                // Detener y eliminar contenedor existente si existe
                bat 'docker stop gestion-tareas-api || echo "No hay contenedor para detener"'
                bat 'docker rm gestion-tareas-api || echo "No hay contenedor para eliminar"'
                
                // Ejecutar el nuevo contenedor
                bat 'docker run -d -p 3000:3000 --name gestion-tareas-api gestion-tareas-api:%BUILD_NUMBER%'
                
                // Esperar a que el contenedor esté listo
                bat 'timeout /t 5'
                
                // Verificar que el contenedor está en ejecución
                bat 'docker ps | findstr gestion-tareas-api'
            }
        }
        
        stage('Verify Docker Container') {
            steps {
                // Mostrar logs del contenedor
                bat 'docker logs gestion-tareas-api'
                
                // Verificar el estado del contenedor
                bat 'docker ps -a | findstr gestion-tareas-api'
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
            bat 'if not exist reports mkdir reports'
            bat 'echo Build Number: %BUILD_NUMBER% > reports\\build-info.txt'
            bat 'echo Build Status: %currentBuild.result% >> reports\\build-info.txt'
            bat 'echo Build URL: %BUILD_URL% >> reports\\build-info.txt'
            bat 'docker images >> reports\\docker-images.txt'
            bat 'docker ps -a >> reports\\docker-containers.txt'
            archiveArtifacts artifacts: 'reports/*', fingerprint: true
        }
    }
}
