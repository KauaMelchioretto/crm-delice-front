import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Typography, CircularProgress } from '@mui/joy';
import { CustomerByState } from '../entities/entities';

import brazilStatesData from '../data/brazil-states.geojson.json';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface LeafletMapProps {
    data?: CustomerByState[];
    error?: string;
    isLoading?: boolean;
}

interface GeoJSONFeatureProperties {
    UF_05?: string;
    MICRO?: string;
    MESO?: string;
    REGIAO?: string;
    NOME_UF?: string;
    GEOCODIGO?: string;
    sigla?: string;
    nome?: string;
    [key: string]: any;
}

interface GeoJSONFeature {
    type: string;
    properties: GeoJSONFeatureProperties;
    geometry: {
        type: string;
        coordinates: any;
    };
}

interface GeoJSONData {
    type: string;
    features: GeoJSONFeature[];
}

const FitBounds = ({ data }: { data: GeoJSONData }) => {
    const map = useMap();
    
    useEffect(() => {
        if (data && data.features && data.features.length > 0) {
            try {
                const bounds = L.geoJSON(data as any).getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            } catch (error) {
                console.warn('Erro ao ajustar bounds:', error);
            }
        }
    }, [data, map]);
    
    return null;
};

export const LeafletMap: React.FC<LeafletMapProps> = ({ data, error, isLoading }) => {
    const [stateData, setStateData] = useState<Record<string, number>>({});

    useEffect(() => {
        if (data) {
            const mappedData: Record<string, number> = {};
            data.forEach(item => {
                mappedData[item.state.toUpperCase()] = item.customer;
            });
            setStateData(mappedData);
        }
    }, [data]);

    const getColorByCustomerCount = useCallback((count: number): string => {
        if (count === 0) return '#f0f0f0';
        if (count <= 5) return '#ffeda0';
        if (count <= 10) return '#feb24c';
        if (count <= 15) return '#fd8d3c';
        if (count <= 20) return '#fc4e2a';
        if (count <= 30) return '#e31a1c';
        return '#800026';
    }, []);

    const styleFeature = useCallback((feature: any) => {
        const properties = feature?.properties as GeoJSONFeatureProperties;
        if (!properties) return {};
        
        const stateCode = properties.UF_05 || 
                         properties.sigla || 
                         '';
        
        const customerCount = stateCode ? stateData[stateCode.toUpperCase()] || 0 : 0;
        
        return {
            fillColor: getColorByCustomerCount(customerCount),
            weight: 1.5,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
        };
    }, [stateData, getColorByCustomerCount]);

    const onEachFeature = useCallback((feature: any, layer: L.Layer) => {
        const properties = feature?.properties as GeoJSONFeatureProperties;
        if (!properties) return;
        
        const stateCode = properties.UF_05 || 
                         properties.sigla || 
                         '';
        
        const stateName = properties.NOME_UF || 
                         properties.nome || 
                         'Estado';
        
        const customerCount = stateCode ? stateData[stateCode.toUpperCase()] || 0 : 0;
        
        layer.bindTooltip(`
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">
                ${stateName} (${stateCode})
            </div>
            <div style="font-size: 12px;">
                <strong>Clientes:</strong> ${customerCount}
            </div>
        `);
    }, [stateData]);

    if (isLoading) {
        return (
            <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: 400,
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress />
                <Typography level="body-sm">Carregando mapa...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: 400,
                flexDirection: 'column',
                gap: 2,
                p: 3
            }}>
                <Typography level="title-lg" color="danger">
                    {error}
                </Typography>
            </Box>
        );
    }

    const hasValidData = brazilStatesData && 
                        (brazilStatesData as GeoJSONData).features && 
                        (brazilStatesData as GeoJSONData).features.length > 0;

    return (
        <Box sx={{ height: '90%', width: '100%', position: 'relative' }}>
            <MapContainer
                center={[-15.7801, -47.9292]}
                zoom={4}
                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                scrollWheelZoom={true}
                minZoom={3}
                maxZoom={8}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <TileLayer
                    attribution=''
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                    noWrap={true}
                />
                
                {hasValidData && (
                    <GeoJSON
                        key={JSON.stringify(stateData)}
                        data={brazilStatesData as any}
                        style={styleFeature}
                        onEachFeature={onEachFeature}
                    />
                )}
                
                <FitBounds data={brazilStatesData as GeoJSONData} />
            </MapContainer>
            
            <Box sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                backgroundColor: 'white',
                padding: 1,
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 1000
            }}>
                <Typography level="body-xs" fontWeight="bold" mb={0.5}>
                    Quantidade de Clientes
                </Typography>
                {[
                    { color: '#f0f0f0', label: '0' },
                    { color: '#ffeda0', label: '1-5' },
                    { color: '#feb24c', label: '6-10' },
                    { color: '#fd8d3c', label: '11-15' },
                    { color: '#fc4e2a', label: '16-20' },
                    { color: '#e31a1c', label: '21-30' },
                    { color: '#800026', label: '31+' }
                ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Box sx={{ 
                            width: 20, 
                            height: 10, 
                            backgroundColor: item.color, 
                            border: '1px solid #ccc',
                            borderRadius: '2px'
                        }} />
                        <Typography level="body-xs">{item.label}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};