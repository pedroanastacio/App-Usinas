#include <SPI.h>
#include <SD.h>

volatile int flow_frequency; // Measures flow sensor pulses
unsigned int l_hour; // Calculated litres/hour
unsigned char flowsensor = 2; // Sensor Input

int led_verm = 10;
int led_verd = 9;

File file;

void flow () // Interrupt function
{
   flow_frequency++;
}

void setup()
{
   pinMode(led_verm, OUTPUT);
   pinMode(led_verd, OUTPUT);
   pinMode(flowsensor, INPUT);

   Serial.begin(9600);

   Serial.println("Iniciando SD CARD");
   while(!SD.begin(4)){
     Serial.println("Falha ao iniciar SD CARD");
   }
   Serial.println("SD CARD Iniciado");

   Serial.println("Gerando arquivo test.txt");
   file = SD.open("test.txt", FILE_WRITE);
   file.close();

   if(SD.exists("test.txt")){
    Serial.println("test existe"); 
   }
   else{
    Serial.println("test não existe");
   }
   
   digitalWrite(led_verd, HIGH);
   digitalWrite(flowsensor, HIGH); // Optional Internal Pull-Up
   attachInterrupt(0, flow, RISING); // Setup Interrupt
   sei(); // Enable interrupts
}

void loop ()
{ 
  digitalWrite(led_verm, HIGH);

  // Pulse frequency (Hz) = 7.5Q, Q is flow rate in L/min.
  l_hour = (flow_frequency * 60 / 7.5); // (Pulse frequency x 60 min) / 7.5Q = flowrate in L/hour
  flow_frequency = 0; // Reset Counter
  Serial.print(l_hour, DEC); // Print litres/hour
  Serial.println(" L/hour");
  
  delay(100);
  digitalWrite(led_verm, LOW);
  delay(900);
}
