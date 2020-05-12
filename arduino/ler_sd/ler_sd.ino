#include <SPI.h>
#include <SD.h>
File myFile;

void setup() {

  Serial.begin(9600);
  while (!Serial) {
    // wait for serial port to connect. Needed for native USB port only
  }
  Serial.print("Iniciando o SD card...");
  if (!SD.begin(10)) {
    Serial.println("Falha na Inicialização!");
    while (1);
  }
  Serial.println("Inicialização concluida.");

  myFile = SD.open("test.txt", FILE_WRITE);

  if (myFile) {
    Serial.print("Escrevendo test.txt...");
    myFile.println("Arquivo teste :)");
    myFile.println("Testando 1, 2, 3.");
    for (int i = 0; i < 20; i++) {
      myFile.println(i);
    }
    myFile.close();
    Serial.println("Feito");
  } else {
    Serial.println("Erro abrindo test.txt");
  }
}

void loop() {
  //
}
