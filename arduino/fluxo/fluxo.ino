#include <SPI.h>
#include <SD.h>
#include "RTClib.h"

RTC_DS3231 rtc;

volatile int flow_frequency;
float l_hora;
float l_seg;
unsigned char flowsensor = 2;
unsigned long currentTime;
unsigned long cloopTime;

float water_consumption = 0.0;
int file_counter = 0;
String temp;

int led_verm = 10;
int led_verd = 9;

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
   
   digitalWrite(led_verd, HIGH);
   digitalWrite(flowsensor, HIGH);
   attachInterrupt(0, flow, RISING);
   currentTime = millis();
   cloopTime = currentTime;

   if(! rtc.begin()){
     Serial.println("DS3231 não encontrado");
   }
   if(rtc.lostPower()){
     Serial.println("DS3231 OK!");
     //rtc.adjust(DateTime(F(__DATE__), F(__TIME__))); //AJUSTAR HORA DO MODULO RTC
   }
   delay(100);

   Serial.println("setor_id,data,litros");
}

void loop ()
{ 
  currentTime = millis();
  
  if(currentTime > (cloopTime + 1000)){
    file_counter++;
    digitalWrite(led_verm, HIGH);
    
    l_hora = ((flow_frequency * 60) / 7.5);
    l_seg = l_hora/3600;
    flow_frequency = 0;
    water_consumption = water_consumption + l_seg;

    if(file_counter == 60){
      DateTime now = rtc.now();

      temp = "1,";
      temp += now.day();
      temp += "/";
      temp += now.month();
      temp += "/";
      temp += now.year();
      temp += " ";
      temp += now.hour();
      temp += ":";
      temp += now.minute();
      temp += ",";
      temp += water_consumption;
      
      Serial.println(temp);
      
      water_consumption = 0;
      file_counter = 0;
    }
    delay(500);
  }
  
  digitalWrite(led_verm, LOW);
  delay(500);
}
