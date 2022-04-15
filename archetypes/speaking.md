---
{{- $slice := split .Name "_" }}
title: "{{ replace (index $slice 1) "-" " " | title }}"
name: "Name of the event"
website: "http://webconf.lv"
video: "https://www.youtube.com/watch?v=F5ZavoihfnY"
dates: "November 14-15, 2015"
country: "Country"
countryISO2: "XX"
city: "City"
date: {{ index $slice 0 }}
draft: true
---
