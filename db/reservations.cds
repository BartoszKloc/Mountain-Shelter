namespace app.interactions;

entity Beds {
    key number : UUID;
        room   : Association to Rooms;
};

entity Rooms {
    key number : UUID;
        beds   : Association to many Beds
                     on beds.room = $self;
};

entity Reservations {
    key ID        : UUID;
        Beds      : Association to Beds;
        Clients   : Association to Clients;
        dateSTART : DateTime;
        dateSTOP  : DateTime;
};

entity Clients {
    key ID          : UUID;
        FirstName   : String(25);
        SecondName  : String(25);
        PhoneNumber : String(9);
        email       : String(30);
};

view Beds_Occupation as
    select
        Reservations.Beds,
        Reservations.dateSTART,
        Reservations.dateSTOP
    from Reservations
    inner join Beds
        on Beds.number = Reservations.Beds;
