using app.interactions from '../db/reservations';

service CatalogService {
    entity Rooms           as projection on interactions.Rooms;
    entity Beds            as projection on interactions.Beds;
    entity Reservations    as projection on interactions.Reservations;
    entity Clients         as projection on interactions.Clients;
    entity Beds_Occupation as projection on interactions.Beds_Occupation;
    function delete(msg : String)                                                                                     returns String;
    function getVacancy(dateStart : String, dateEnd : String)                                                         returns String;
    function updateClient(ID : String, FirstName : String, SecondName : String, PhoneNumber : String, email : String) returns String;
}
