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
                // Usando el plugin Docker para construir la imagen
                script {
                    def customImage = docker.build("gestion-tareas-api:${env.BUILD_NUMBER}")
                    // Etiquetar la imagen como latest
                    customImage.tag('latest')
                }
            }
        }
        
        stage('Run Docker Container') {
            steps {
                script {
                    // Detener y eliminar el contenedor existente si existe
                    bat '''
                        docker stop gestion-tareas-api || echo "No hay contenedor para detener"
                        docker rm gestion-tareas-api || echo "No hay contenedor para eliminar"
                    '''
                    
                    // Ejecutar el nuevo contenedor usando el plugin Docker
                    docker.image("gestion-tareas-api:${env.BUILD_NUMBER}").run('-p 3000:3000 --name gestion-tareas-api')
                    
                    // Esperar a que el contenedor esté listo
                    bat 'timeout /t 10'
                }
            }
        }
        
        stage('Verify Docker Container') {
            steps {
                script {
                    // Verificar que el contenedor está en ejecución
                    def containerRunning = bat(script: 'docker ps | findstr gestion-tareas-api', returnStatus: true) == 0
                    
                    if (!containerRunning) {
                        error "El contenedor no está en ejecución"
                    }
                    
                    // Mostrar logs del contenedor
                    bat 'docker logs gestion-tareas-api'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline ejecutado exitosamente!'
        }
        failure {
            echo 'El pipeline ha fallado.'
            bat '''
                echo "Mostrando información de diagnóstico:"
                docker ps -a
                docker images
                echo "Logs del contenedor (si existe):"
                docker logs gestion-tareas-api || echo "No se pueden obtener logs"
            '''
        }
        always {
            echo 'Generando reporte...'
            bat 'if not exist reports mkdir reports'
            bat 'echo Build Number: %BUILD_NUMBER% > reports\\build-info.txt'
            bat 'echo Build Status: %currentBuild.result% >> reports\\build-info.txt'
            bat 'echo Build URL: %BUILD_URL% >> reports\\build-info.txt'
            bat 'docker images > reports\\docker-images.txt || echo "No se pueden listar imágenes" > reports\\docker-images.txt'
            bat 'docker ps -a > reports\\docker-containers.txt || echo "No se pueden listar contenedores" > reports\\docker-containers.txt'
            archiveArtifacts artifacts: 'reports/*', fingerprint: true
        }
    }
}
