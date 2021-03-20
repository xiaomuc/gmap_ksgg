// 場所クラス定義
var Place = function (location, title, description, label) {
    // 位置情報
    this.location = location;
    // タイトル
    this.title = title;
    // 説明
    this.description = description;
    // マーカのラベル
    this.label = label;
}

//コースクラス
var Course = function (places, route, courseOption) {
    // マーカを配置する場所
    this.places = places;
    // ルート表示に使用する地点
    this.route = route;
    // ズームサイズ(既定:15)
    this.zoom = (courseOption === undefined || courseOption.zoom === undefined) ? 15 : courseOption.zoom;
    // ルート検索モード(既定:徒歩)
    this.travelmode = (courseOption === undefined || courseOption.travelmode === undefined) ? 'WALKING' : courseOption.travelmode;
    // 地図タイプ(既定:ロードマップ)
    this.mapTypeId = (courseOption === undefined || courseOption.mapTypeId === undefined) ? undefined : courseOption.mapTypeId;
};

//  マーカー作成処理
function setMarker(map, place, infowindow) {
    // マーカー
    var marker = new google.maps.Marker({
        position: place.location,
        map: map,
        label: place.label,
        title: place.title
    });

    // イベントで説明ウィンドウ表示
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent('<div><strong>' + place.title + '</strong><br />' + place.description + '</div>');
        infowindow.open(map, this);
    });
    marker.setMap(map);
}

// ルート作成処理　　　　　　　　　
function setDirection(map, course) {
    places = course.route;

    //ルート用のレイヤ
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true
    });

    //経由ポイント生成
    var waypoints = [];
    for (i = 1; i < places.length - 1; i++) {
        waypoints.push({
            location: places[i].location,
            stopover: true
        });
    }
    //ルート用のリクエストオブジェクト
    var request = {
        destination: places[places.length - 1].location,
        origin: places[0].location,
        waypoints: waypoints,
        travelMode: course.travelmode
    };

    // Pass the directions request to the directions service.
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (response, status) {
        if (status == 'OK') {
            // Display the route on the map.
            directionsDisplay.setDirections(response);
        }
    });
}

// 文字列から経緯度オブジェクト生成
function getLatLngFromString(ll) {
    var latlng = ll.split(/, ?/)
    return new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
}

// inputタグのvalue属性を取得
function getVal(id) {
    var element = document.getElementById(id);
    if (element == null) return undefined;
    var value = element.getAttribute('value');
    return value;
}

// inputタグのValue属性を数値変換
function getIntVal(id) {
    var text = getVal(id);
    if (text == undefined) return undefined;
    return Number(text);
}

// formの情報から地図作成に使用する情報を取得
function getCourseFromPage() {
    // 登録地点数を取得
    var count = getIntVal('count');
    return getCourceFromPage2(0, count);
}

function getCourceFromPage2(start, count)
var places = new Array();
var route = new Array();
for (var i = start; i < count; i++) {
    var pri = 'p' + i + '-';
    var latlngtext = getVal(pri + 'latlng');
    var title = getVal(pri + 'title');
    var desc = getVal(pri + 'description');
    var label = getVal(pri + 'label');
    var skip = getVal(pri + 'skip');
    var marker = getVal(pri + 'marker');
    var p = new Place(getLatLngFromString(latlngtext), title, desc, label);
    if (marker == undefined) {
        places.push(p);
    }
    if (skip == undefined) {
        route.push(p);
    }
}
var opt = {};
opt.travelmode = getVal('travelmode');
opt.mapTypeId = getVal('mapTypeId');
opt.zoom = getIntVal('zoom');
return new Course(places, route, opt);
}

var MAP_ELEMENT = "map";

// google map javascript apiから呼ばれるコールバック関数
function initMap() {
    //Mapを埋め込むエレメントを検索
    element = document.getElementById(MAP_ELEMENT);
    if (element == null) return;

    //エレメントのタイトル属性からコースを特定
    var course = getCourseFromPage2(0, 4);
    if (course == null) return;
    var cource2 = getCourceFromPage2(4, 9);

    //縮尺、中央を設定、マウスホイールによる拡大縮小を抑止
    var mapOptions = {
        zoom: course.zoom,
        scrollwheel: false,
        center: course.places[0].location,
        mapTypeId: course.mapTypeId,
        styles: [{
            elementType: 'geometry',
            stylers: [{
                color: '#ebe3cd'
            }]
        }, {
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#523735'
            }]
        }, {
            elementType: 'labels.text.stroke',
            stylers: [{
                color: '#f5f1e6'
            }]
        }, {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#c9b2a6'
            }]
        }, {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#dcd2be'
            }]
        }, {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#ae9e90'
            }]
        }, {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{
                color: '#dfd2ae'
            }]
        }, {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{
                color: '#dfd2ae'
            }]
        }, {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#93817c'
            }]
        }, {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#a5b076'
            }]
        }, {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#447530'
            }]
        }, {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{
                color: '#f5f1e6'
            }]
        }, {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{
                color: '#fdfcf8'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{
                color: '#f8c967'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#e9bc62'
            }]
        }, {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{
                color: '#e98d58'
            }]
        }, {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#db8555'
            }]
        }, {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#806b63'
            }]
        }, {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{
                color: '#dfd2ae'
            }]
        }, {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#8f7d77'
            }]
        }, {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{
                color: '#ebe3cd'
            }]
        }, {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{
                color: '#dfd2ae'
            }]
        }, {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#b9d3c2'
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#92998d'
            }]
        }]
    };

    //マップオブジェクト生成
    var map = new google.maps.Map(element, mapOptions);

    //情報ウィンドウ
    var infowindow = new google.maps.InfoWindow();
    infowindow.setOptions({
        maxWidth: 200
    })

    //マーカーを生成
    for (var i = 0; i < course.places.length; i++) {
        setMarker(map, course.places[i], infowindow);
    }
    //ルートの作成
    if (course.route.length > 0) {
        setDirection(map, course);
        setDirection(map, cource2);
    }
}
