volatile int flow_frequency; // Measures flow sensor pulses
unsigned int l_hour; // Calculated litres/hour
unsigned char flowsensor = 2; // Sensor Input

int led_verm = 13;
int led_verd = 12;

void flow () // Interrupt function
{
   flow_frequency++;
}

void setup()
{
   pinMode(led_verm, OUTPUT);
   pinMode(led_verd, OUTPUT);
   pinMode(flowsensor, INPUT);
   
   digitalWrite(led_verd, HIGH);
   digitalWrite(flowsensor, HIGH); // Optional Internal Pull-Up
   Serial.begin(9600);
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
