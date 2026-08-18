import "./style.css";
import "leaflet/dist/leaflet.css";
import { getIpAddressOrDomain } from "./services/apiResponse";
import L from 'leaflet';
import type { IpApiResponse } from "./models/ip_model";

let map: L.Map | null = null;
let marker: L.Marker;

const ipv4Pattern =
    /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;

const ipv6Pattern =
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})$|^:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)$/;

const domainPattern =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

const error = document.getElementById("error") as HTMLSpanElement;
const form = document.getElementById("form") as HTMLFormElement;
const textField = document.getElementById("textField") as HTMLInputElement;
const ip = document.getElementById("ip") as HTMLElement;
const location = document.getElementById("location") as HTMLElement;
const timeZone = document.getElementById("timeZone") as HTMLElement;
const isp = document.getElementById("isp") as HTMLElement;



function updateDisplayList(data: IpApiResponse) {

    ip.textContent = data.ip;
    location.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timeZone.textContent = `UTC${data.location.timezone}`;
    isp.textContent = data.isp !== '' ? 'N/A' : data.isp;

}

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
        marker = L.marker([
            coordinate.lat,
            coordinate.lng
        ]).addTo(map);

        marker.bindPopup(`<center><b>${coordinate.country}</b> | ${coordinate.region} | ${coordinate.city} <br /> { lat : ${coordinate.lat}  , long: ${coordinate.lng} } </center>`).openPopup();
        updateDisplayList(data)
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

        marker = L.marker([
            coordinate.lat,
            coordinate.lng
        ]).addTo(map);

        marker.bindPopup(`<center><b>${coordinate.country}</b> | ${coordinate.region} | ${coordinate.city} <br /> { lat : ${coordinate.lat}  , long: ${coordinate.lng} } </center>`).openPopup();
        updateDisplayList(data)
    }
    else {
        map.setView(
            [coordinate.lat, coordinate.lng],
            13
        );

        marker = L.marker([
            coordinate.lat,
            coordinate.lng
        ]).addTo(map);

        marker.bindPopup(`<center><b>${coordinate.country}</b> | ${coordinate.region} | ${coordinate.city} <br /> { lat : ${coordinate.lat}  , long: ${coordinate.lng} } </center>`).openPopup();
        updateDisplayList(data)
    }
})




// const result = await getIpAddressOrDomain();
// console.log(result)