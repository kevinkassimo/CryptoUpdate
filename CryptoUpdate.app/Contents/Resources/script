#!/bin/bash

function prompt() {
    osascript <<EOT
tell app "System Events"
      text returned of (display dialog "$1" default answer "$2" buttons {"OK"} default button 1 with title "$3")
    end tell
EOT
}

function connecting() {
osascript <<EOT
display dialog "Fetching data..." buttons {"Ok"} default button 1 with title "CryptoUpdate @ Fetching" giving up after 10
EOT
}

function alert() {
osascript <<EOT
set DIALOG to (display dialog "$1" buttons {"OK", "Quit"} default button 2 with icon note with title "CryptoUpdate @ Running" giving up after 10)
if button returned of DIALOG is "OK" then 
  return
end if
tell app "System Events"
  button returned of DIALOG
end tell
EOT
}

currency_name="$(prompt 'Cryptocurrency name (as listed on CoinMarketCap):' '' 'CryptoUpdate @ Currency')"
while [ -z $currency_name ]
do
    currency_name="$(prompt '(Cannot be empty) Cryptocurrency name (as listed on CoinMarketCap):' '' 'CryptoUpdate @ Currency')"
done

purchase_amt="$(prompt 'Total Amount purchased:' '' 'CryptoUpdate @ Amount')"
while ! [[ $purchase_amt =~ ^[+-]?[0-9]+\.?[0-9]*$ ]]
do
    purchase_amt="$(prompt '(Number only) Total Amount purchased:' '' 'CryptoUpdate @ Amount')"
done

purchase_cost="$(prompt 'Total purchase cost (in USD):' '' 'CryptoUpdate @ Cost')"
while ! [[ $purchase_cost =~ ^[+-]?[0-9]+\.?[0-9]*$ ]]
do
    purchase_cost="$(prompt '(Number only) Total purchase cost (in USD):' '' 'CryptoUpdate @ Cost')"
done

OLD_IFS=$IFS

IFS="
"

connecting

#phantomjs value.js $currency_name $purchase_amt $purchase_cost | \
# { while read -r line
#  do
#    button_name="$(alert $line)"
#    if [ "$button_name" == "Quit" ]; then
#	break
#    fi
#  done
#}
while read -r line
  do
    button_name="$(alert $line)"
    if [ "$button_name" == "Quit" ]; then
        break
    fi
  done < <(/usr/local/bin/phantomjs value.js $currency_name $purchase_amt $purchase_cost)
wait
echo "hello"
kill $(ps aux | grep -e "[p]hantomjs value.js $currency_name $purchase_amt $purchase_cost" | awk '{print $2}')

IFS=$OLD_IFS
exit 0