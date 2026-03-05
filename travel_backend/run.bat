@echo off
echo Compiling Java files...
javac -cp "." -d "target/classes" src/main/java/com/travel/platform/*.java src/main/java/com/travel/platform/*/*.java

echo Downloading dependencies...
mkdir lib 2>nul
curl -o lib/spring-boot-starter-web-3.2.0.jar https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-web/3.2.0/spring-boot-starter-web-3.2.0.jar
curl -o lib/spring-boot-starter-data-jpa-3.2.0.jar https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-data-jpa/3.2.0/spring-boot-starter-data-jpa-3.2.0.jar
curl -o lib/h2-2.2.224.jar https://repo1.maven.org/maven2/com/h2database/h2/2.2.224/h2-2.2.224.jar

echo Starting application...
java -cp "target/classes;lib/*" com.travel.platform.TravelApplication
pause