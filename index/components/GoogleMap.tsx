import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { colors } from '@/constants/colors';
import { MapPin, Navigation, Clock, IndianRupee } from 'lucide-react-native';
import { locationCoordinates } from '@/constants/locations';

// Conditionally import WebView to prevent bundling issues
let WebView: any = null;
if (Platform.OS !== 'web') {
  // Only import on native platforms
  WebView = require('react-native-webview').WebView;
}

interface GoogleMapProps {
  initialLocation?: string;
  markers?: Array<{
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    available?: boolean;
    price?: number;
    priceUnit?: string;
    availableUntil?: string;
  }>;
  onMarkerPress?: (markerId: string) => void;
  onLocationSelect?: (location: { latitude: number; longitude: number }) => void;
  selectable?: boolean;
  selectedLocation?: { latitude: number; longitude: number };
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  initialLocation = 'Hyderabad',
  markers = [],
  onMarkerPress,
  onLocationSelect,
  selectable = false,
  selectedLocation,
}) => {
  const [currentLocation, setCurrentLocation] = useState<string>(initialLocation);
  const [mapReady, setMapReady] = useState(false);

  // Get coordinates for the initial location
  const getInitialCoordinates = () => {
    if (locationCoordinates[initialLocation]) {
      return locationCoordinates[initialLocation];
    }
    // Default to Hyderabad city center if location not found
    return { latitude: 17.3850, longitude: 78.4867 };
  };

  const initialCoordinates = getInitialCoordinates();

  // Create the HTML content for the map
  const getMapHtml = () => {
    const markersString = markers.map(marker => {
      const markerColor = marker.available ? '#22c55e' : '#ef4444'; // Green for available, red for unavailable
      
      return `
        var marker${marker.id} = new google.maps.Marker({
          position: {lat: ${marker.latitude}, lng: ${marker.longitude}},
          map: map,
          title: "${marker.title}",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "${markerColor}",
            fillOpacity: 0.8,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 10
          }
        });
        
        var infowindow${marker.id} = new google.maps.InfoWindow({
          content: "<div style='padding: 8px; max-width: 200px;'>" +
            "<div style='font-weight: bold; margin-bottom: 4px;'>${marker.title}</div>" +
            "<div style='display: flex; align-items: center; margin-bottom: 4px;'>" +
            "<span style='color: ${markerColor}; font-weight: bold; margin-right: 4px;'>●</span>" +
            "<span>${marker.available ? 'Available' : 'Occupied'}</span>" +
            "</div>" +
            "${marker.price ? "<div style='margin-bottom: 4px;'>₹" + marker.price + "/" + marker.priceUnit + "</div>" : ''}" +
            "${marker.availableUntil ? "<div style='font-size: 12px; color: #666;'>Available until: " + marker.availableUntil + "</div>" : ''}" +
            "</div>"
        });
        
        marker${marker.id}.addListener('click', function() {
          infowindow${marker.id}.open(map, marker${marker.id});
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'marker_click',
            id: "${marker.id}"
          }));
        });
      `;
    }).join('');

    const selectedLocationMarker = selectedLocation ? `
      var selectedLocationMarker = new google.maps.Marker({
        position: {lat: ${selectedLocation.latitude}, lng: ${selectedLocation.longitude}},
        map: map,
        title: "Selected Location",
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "${colors.primary}",
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 12
        }
      });
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            body, html, #map {
              height: 100%;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            function initMap() {
              var initialLocation = {lat: ${initialCoordinates.latitude}, lng: ${initialCoordinates.longitude}};
              var map = new google.maps.Map(document.getElementById('map'), {
                center: initialLocation,
                zoom: 13,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [
                  {
                    featureType: "poi.business",
                    stylers: [{ visibility: "off" }]
                  },
                  {
                    featureType: "transit",
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }]
                  }
                ]
              });
              
              ${markersString}
              ${selectedLocationMarker}
              
              ${selectable ? `
                map.addListener('click', function(event) {
                  // Remove previous marker if exists
                  if (window.selectedLocationMarker) {
                    window.selectedLocationMarker.setMap(null);
                  }
                  
                  // Create new marker
                  window.selectedLocationMarker = new google.maps.Marker({
                    position: event.latLng,
                    map: map,
                    title: "Selected Location",
                    animation: google.maps.Animation.DROP,
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: "${colors.primary}",
                      fillOpacity: 0.8,
                      strokeColor: "#ffffff",
                      strokeWeight: 2,
                      scale: 12
                    }
                  });
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'map_click',
                    latitude: event.latLng.lat(),
                    longitude: event.latLng.lng()
                  }));
                });
              ` : ''}
              
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'map_ready'
              }));
            }
          </script>
          <script async defer
            src="https://maps.googleapis.com/maps/api/js?callback=initMap">
          </script>
        </body>
      </html>
    `;
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'map_ready') {
        setMapReady(true);
      } else if (data.type === 'marker_click' && onMarkerPress) {
        onMarkerPress(data.id);
      } else if (data.type === 'map_click' && onLocationSelect) {
        onLocationSelect({
          latitude: data.latitude,
          longitude: data.longitude
        });
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // Web fallback component
  const WebMapFallback = () => (
    <View style={styles.webFallback}>
      <View style={styles.webMapContainer}>
        <View style={styles.webMapHeader}>
          <Text style={styles.webMapTitle}>Map View</Text>
          <Text style={styles.webMapSubtitle}>Showing parking spots in {currentLocation}</Text>
        </View>
        
        <View style={styles.webMapContent}>
          <View style={styles.webMapPin}>
            <MapPin size={32} color={colors.primary} />
          </View>
          <Text style={styles.webMapText}>
            Interactive map is available in the mobile app.
          </Text>
          <Text style={styles.webMapDescription}>
            {markers.length} parking spots available in this area.
          </Text>
        </View>
        
        {markers.map((marker) => (
          <Pressable 
            key={marker.id}
            style={[
              styles.webMapMarker,
              marker.available ? styles.webMapMarkerAvailable : styles.webMapMarkerUnavailable
            ]}
            onPress={() => onMarkerPress && onMarkerPress(marker.id)}
          >
            <View style={[
              styles.markerStatusDot,
              marker.available ? styles.availableDot : styles.unavailableDot
            ]} />
            <View style={styles.webMapMarkerContent}>
              <Text style={styles.webMapMarkerTitle}>{marker.title}</Text>
              {marker.price && (
                <View style={styles.priceContainer}>
                  <IndianRupee size={12} color={colors.text} />
                  <Text style={styles.priceText}>
                    {marker.price}/{marker.priceUnit}
                  </Text>
                </View>
              )}
              {marker.availableUntil && (
                <View style={styles.timeContainer}>
                  <Clock size={12} color={colors.textLight} />
                  <Text style={styles.timeText}>
                    {marker.available 
                      ? `Available until: ${marker.availableUntil}`
                      : `Available after: ${marker.availableUntil}`
                    }
                  </Text>
                </View>
              )}
            </View>
            <Navigation size={16} color={colors.primary} />
          </Pressable>
        ))}
        
        {selectable && (
          <View style={styles.webSelectLocationContainer}>
            <Text style={styles.webSelectLocationText}>
              To select a location, please use the mobile app.
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // Use WebMapFallback on web platform
  if (Platform.OS === 'web') {
    return <WebMapFallback />;
  }

  // Use WebView on native platforms
  return (
    <View style={styles.container}>
      {WebView && (
        <WebView
          style={styles.map}
          originWhitelist={['*']}
          source={{ html: getMapHtml() }}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={false}
        />
      )}
      
      {!mapReady && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
  },
  webFallback: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  webMapContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  webMapHeader: {
    marginBottom: 16,
  },
  webMapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  webMapSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  webMapContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    marginBottom: 16,
  },
  webMapPin: {
    marginBottom: 16,
  },
  webMapText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  webMapDescription: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  webMapMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  webMapMarkerAvailable: {
    borderLeftColor: colors.success,
  },
  webMapMarkerUnavailable: {
    borderLeftColor: colors.error,
  },
  webMapMarkerContent: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  webMapMarkerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  markerStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  availableDot: {
    backgroundColor: colors.success,
  },
  unavailableDot: {
    backgroundColor: colors.error,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  webSelectLocationContainer: {
    padding: 12,
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  webSelectLocationText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
});