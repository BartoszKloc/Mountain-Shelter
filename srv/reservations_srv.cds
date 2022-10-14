using app.interactions from '../db/reservations';

service CatalogService {
    entity Rooms        as projection on interactions.Rooms;
    entity Beds         as projection on interactions.Beds;
    entity Reservations as projection on interactions.Reservations;
    entity Clients      as projection on interactions.Clients;
    function dupa(msg : String) returns String;
}
