import "leaflet/dist/leaflet.css";
import { getIpAddressOrDomain } from "./services/apiResponse";
import L from 'leaflet';
import type { IpApiResponse } from "./models/ip_model";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let map: L.Map | null = null;
let marker: L.Marker;


delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;

const ipv6Pattern = /^[0-9a-fA-F:]+$/;
const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const error = document.getElementById("error") as HTMLSpanElement;
const form = document.getElementById("form") as HTMLFormElement;
const textField = document.getElementById("textField") as HTMLInputElement;
const ip = document.getElementById("ip") as HTMLElement;
const location = document.getElementById("location") as HTMLElement;
const timeZone = document.getElementById("timeZone") as HTMLElement;
const isp = document.getElementById("isp") as HTMLElement;



function updateDisplayList(data: IpApiResponse, map: L.Map) {

    if (marker) {
        marker.setLatLng([data.location.lat, data.location.lng]);
    } else {
        marker = L.marker([data.location.lat, data.location.lng]).addTo(map);
    }

    marker
        .bindPopup(`<center><b>${data.location.country}</b> | ${data.location.region} | ${data.location.city} <br /> { lat : ${data.location.lat}, long: ${data.location.lng} } </center>`)
        .openPopup();

    ip.textContent = data.ip;
    location.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timeZone.textContent = `UTC${data.location.timezone}`;
    isp.textContent = data.isp !== '' ? 'N/A' : data.isp;

}

textField.addEventListener("input", () => {
    textField.setCustomValidity("");
    error.textContent = "";
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const value = textField.value.trim();

    if (value === "") {
        textField.setCustomValidity("Please enter an IP address or domain.");
        error.textContent = 'Please enter an IP address or domain.';
        textField.reportValidity();
        return;
    }

    const isIPv4 = ipv4Pattern.test(value);
    const isIPv6 = ipv6Pattern.test(value);
    const isDomain = domainPattern.test(value);

    if (!isIPv4 && !isIPv6 && !isDomain) {
        textField.setCustomValidity(
            "Please enter a valid IPv4, IPv6 address, or domain."
        );
        error.textContent =
            "Please enter a valid IPv4, IPv6 address, or domain.";
        textField.reportValidity();
        return;
    }

    let key: "ipAddress" | "domain";

    if (isIPv4 || isIPv6) {
        key = "ipAddress";
    } else {
        key = "domain";
    }

    textField.setCustomValidity("");
    error.textContent = '';


    const data = await getIpAddressOrDomain(key, value);
    const coordinate = data.location;

    if (map) {
        map.setView(
            [coordinate.lat, coordinate.lng],
            13
        );
        updateDisplayList(data, map)
    }

});

document.addEventListener("DOMContentLoaded", async () => {
    const data = await getIpAddressOrDomain();
    const coordinate = data.location;

    if (!map) {
        map = L.map("map", {
            center: [coordinate.lat, coordinate.lng],
            zoom: 13
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        updateDisplayList(data, map)
    }
    else {
        map.setView(
            [coordinate.lat, coordinate.lng],
            13
        );

        updateDisplayList(data, map)
    }
})
