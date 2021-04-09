# Create a route map in your website using Google Maps JavaScript Api

[日本語版へ](https://qiita.com/xkogij/items/2554c37929caf6f6fc3c)

## Introduction

Years ago, the group renewed its website with its members. Of course, I joined this as an architect and an engineer, and a programmer. I built some programs to show our tour route on maps using Goole Maps JavaScript API.
Recently, I need to fix the programs so that I read them first in a while.  But, you know, I've forgotten most. I how to read through and I have to understand what did I do. For me, it's always happened, is it?
Anyway, I have to write it down somewhere what I have done. This is it.
And also, it is a good chance to write a document like this to help somebody else, I believe.

### see also

The goodwill guide volunteer's site

https://volunteerguide-ksgg.jp/

Google Maps JavaScript API page

https://developers.google.com/maps/documentation/javascript/overview

### Goole Maps API key
You need to get a Google Maps API key for your own. Maybe you can find how to get it on the web so I won't explain about it.

## HTML
For call back from the google maps API.

```
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&language=en&callback=initMap&libraries=&v=weekly" async>
```

- You have to get your API key from the google site, and "YOUR_API_KEY" is supposed to replace with your API key.

### How to set the route in HTML
* You can set the route using "form". 
* In it, you set information using hidden "input" tags. Just like a key-value dictionary, attribute "id" as a key and attribute "value" as value.
* The "id"s exclude "count" are shaped "pn-xxxx". In it, "n" is number 0 to count-1, "xxxx" is the kind of this data (ie. label, title,etc) 

#### count
* Set how many points you use.

#### pn-label
The marker's label like "Start", "1", "2", 
If you set the label "-b-", the route will be separated. I will explain these multiple route on a map later.

#### pn-latlng
Set latitude and longitude using a comma.

#### pn-title
If you click the marker, you see a popup window and it shows the title and description of the marker. Set the title of the popup window.

#### pn-description
Set the description of the popup window.

### Optional
#### pn-marker
If you set value="0", a marker for this won't set on the map.
You use this as a waypoint. In case you don't want a marker but you want to set where to go.

#### pn-skip
If you set value="1", this point will not include in the route.
In case you want a marker but don't want to include it in route.

#### travelmode
You can use below
* **WALKING** (default)
* DRIVING
* BICYCLING
* TRANSIT

#### mapTypeId
Set the type of the map.

| value | desc |
|:-:|:-:|
| **ROADMAP** | (default) The map with roads, buildings, etc.|
| SATELLITE | The satellite photo map. |
| HYBRID | Mixed with ROADMAP and SATELLITE |
| TERRAIN | The map shows terrain. |

## JavaScript(maps.js)
### classes
#### Place class
Read place information from HTML form and store these.
It has attributes such as location, title, and description of the point.
#### Course class
This class stores map types, routes, places, etc.

### sub-functions
#### setMarker

parameter map and infowindow are used in the initMap function.
parameter place is instance of Place class.

#### setDirections

Create routes using Directions API.
Object "course" is an instance of the Course class above,  map and bounds are created in intiMap function. The index is for the course.routes array, mostly zero.
The routes array is a list of waypoints. The first one is the origin the last one is the destination.
The bounds.union is used in fitBounds function to set the zoom of the map.

#### getCourseFromPage
From HTML form, get route information and create a course object.
"count" is the number of waypoints, it is set as a loop counter.
Read from input tag:
* create Place object
* if "marker" is not defined, it means you need a marker on the map, so add to the place list.
* if "skip" is not defined, it means you want to include this point to the route, so add to the route list.
* if the label is "-b-", add the route to the routes list and create a new route object. it divides the route.

#### getLatLngFromString
This function creates a LatLng object from a string.

#### getVal
This function gets value from the input tag identified by id.

#### getIntVal
This function gets an integer value from the input tag identified by id.

### intiMap
Google maps call back this function.
Get div tag in HTML by id for mount the map.
Get course information.
The mapOptions are for map color settings. Without this, all functions work well.

https://developers.google.com/maps/documentation/javascript/examples/maptype-styled-simple#maps_maptype_styled_simple-javascript/

The routes array is in for-loop in case of the route divided.

## Divide the route
We made a new course map on our website. But the route was weird.
A facility on the map, you can go through it but google maps didn't show the way go through. The route goes far away around to.
I tried to find some waypoint to show a good route, but I couldn't find any. So I decided to divide the route into two different routes.
I changed:
In Course class route change to routes array.
If pn-label has the value "-b-", divide the route.
If you define pn-marker and pn-skip at the same time, you can set a point with no marker and not include it in the route.
So it works better.

https://volunteerguide-ksgg.jp/tours/ym-1/
