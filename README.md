# Maquina de Canvi 
Aplicacio per calcular el canvi a l'hora de que un client pagui. Feta per Victor Comino i Marc Peral

# Ús
L'aplicacio està pensada per fer-se servir com una màquina de canvi automàtica. Una vegada s'introdueix l'import, en el moment que l'usuari introdueix suficient pagament (Import: 12€ - Pagament: 15€), l'aplicacio calcula el canvi fent servir el que té en la caixa, i retorna el canvi a l'usuari.

L'import es pot afegir fent servir el teclat (números i coma ",") i per esborrar es pot fer servir la tecla d'esborrar i suprimir.

# Instal·lacio
Per poder instal·lar-lo s'ha de tenir la dependencia de JQuery per TypeScript
```bash
npm install
```
# Compilació
Instal·lada la dependencia, es pot compilar i desplegar sense problemes.
## VSCode
Amb VSCode es pot fer servir la comanda:
```bash
Ctrl + Shift + B
```
per poder desplegar el menu de tasques, i allá seleccionar "tsc: build" o "tsc: watch" per compilar el projecte.

## Terminal
Amb la terminal, s'ha de fer servir la comanda:
```bash
tsc
```

