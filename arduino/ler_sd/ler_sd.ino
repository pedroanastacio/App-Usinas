#include <SPI.h>
#include <SD.h>
File myFile;

const int buttonPin = 3;

void setup() {
  pinMode(buttonPin, INPUT);
}


void loop() {
  int buttonState;
  buttonState = digitalRead(buttonPin);

  if (buttonState == LOW)
  {
    cartaosd();
  }
}


void cartaosd() {
  Serial.begin(9600);

  Serial.print("Iniciando o SD card...");
  if (!SD.begin(10)) {
    Serial.println("Falha na Inicialização!");
    while (1);
  }
  Serial.println("Inicialização concluida.");

  myFile = SD.open("test.txt", FILE_WRITE);

  if (myFile) {
    Serial.print("Escrevendo arquivo no SD...");
    myFile.println("Arquivo teste");
    
    myFile.close();
    Serial.println("Feito");
  } else {
    Serial.println("Erro abrindo test.txt");
  }
}
