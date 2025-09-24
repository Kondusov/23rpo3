<?php
// Enable strict types and robust error handling
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// List of Russian federal subjects with oblast centers and IANA timezones
$centers = [
    // Central Federal District
    ['region' => 'Белгородская область', 'city' => 'Белгород', 'tz' => 'Europe/Moscow'],
    ['region' => 'Брянская область', 'city' => 'Брянск', 'tz' => 'Europe/Moscow'],
    ['region' => 'Владимирская область', 'city' => 'Владимир', 'tz' => 'Europe/Moscow'],
    ['region' => 'Воронежская область', 'city' => 'Воронеж', 'tz' => 'Europe/Moscow'],
    ['region' => 'Ивановская область', 'city' => 'Иваново', 'tz' => 'Europe/Moscow'],
    ['region' => 'Калужская область', 'city' => 'Калуга', 'tz' => 'Europe/Moscow'],
    ['region' => 'Костромская область', 'city' => 'Кострома', 'tz' => 'Europe/Moscow'],
    ['region' => 'Курская область', 'city' => 'Курск', 'tz' => 'Europe/Moscow'],
    ['region' => 'Липецкая область', 'city' => 'Липецк', 'tz' => 'Europe/Moscow'],
    ['region' => 'Московская область', 'city' => 'Москва', 'tz' => 'Europe/Moscow'],
    ['region' => 'Орловская область', 'city' => 'Орёл', 'tz' => 'Europe/Moscow'],
    ['region' => 'Рязанская область', 'city' => 'Рязань', 'tz' => 'Europe/Moscow'],
    ['region' => 'Смоленская область', 'city' => 'Смоленск', 'tz' => 'Europe/Moscow'],
    ['region' => 'Тамбовская область', 'city' => 'Тамбов', 'tz' => 'Europe/Moscow'],
    ['region' => 'Тверская область', 'city' => 'Тверь', 'tz' => 'Europe/Moscow'],
    ['region' => 'Тульская область', 'city' => 'Тула', 'tz' => 'Europe/Moscow'],
    ['region' => 'Ярославская область', 'city' => 'Ярославль', 'tz' => 'Europe/Moscow'],

    // Northwestern Federal District
    ['region' => 'Республика Карелия', 'city' => 'Петрозаводск', 'tz' => 'Europe/Moscow'],
    ['region' => 'Республика Коми', 'city' => 'Сыктывкар', 'tz' => 'Europe/Moscow'],
    ['region' => 'Архангельская область', 'city' => 'Архангельск', 'tz' => 'Europe/Moscow'],
    ['region' => 'Вологодская область', 'city' => 'Вологда', 'tz' => 'Europe/Moscow'],
    ['region' => 'Калининградская область', 'city' => 'Калининград', 'tz' => 'Europe/Kaliningrad'],
    ['region' => 'Ленинградская область', 'city' => 'Санкт-Петербург', 'tz' => 'Europe/Moscow'],
    ['region' => 'Мурманская область', 'city' => 'Мурманск', 'tz' => 'Europe/Moscow'],
    ['region' => 'Новгородская область', 'city' => 'Великий Новгород', 'tz' => 'Europe/Moscow'],
    ['region' => 'Псковская область', 'city' => 'Псков', 'tz' => 'Europe/Moscow'],

    // Southern and North Caucasus Federal Districts
    ['region' => 'Краснодарский край', 'city' => 'Краснодар', 'tz' => 'Europe/Moscow'],
    ['region' => 'Ростовская область', 'city' => 'Ростов-на-Дону', 'tz' => 'Europe/Moscow'],
    ['region' => 'Астраханская область', 'city' => 'Астрахань', 'tz' => 'Europe/Samara'],
    ['region' => 'Волгоградская область', 'city' => 'Волгоград', 'tz' => 'Europe/Volgograd'],
    ['region' => 'Ставропольский край', 'city' => 'Ставрополь', 'tz' => 'Europe/Moscow'],

    // Volga Federal District
    ['region' => 'Республика Марий Эл', 'city' => 'Йошкар-Ола', 'tz' => 'Europe/Moscow'],
    ['region' => 'Республика Мордовия', 'city' => 'Саранск', 'tz' => 'Europe/Moscow'],
    ['region' => 'Чувашская Республика', 'city' => 'Чебоксары', 'tz' => 'Europe/Moscow'],
    ['region' => 'Кировская область', 'city' => 'Киров', 'tz' => 'Europe/Kirov'],
    ['region' => 'Нижегородская область', 'city' => 'Нижний Новгород', 'tz' => 'Europe/Moscow'],
    ['region' => 'Оренбургская область', 'city' => 'Оренбург', 'tz' => 'Asia/Yekaterinburg'],
    ['region' => 'Пензенская область', 'city' => 'Пенза', 'tz' => 'Europe/Moscow'],
    ['region' => 'Пермский край', 'city' => 'Пермь', 'tz' => 'Asia/Yekaterinburg'],
    ['region' => 'Самарская область', 'city' => 'Самара', 'tz' => 'Europe/Samara'],
    ['region' => 'Саратовская область', 'city' => 'Саратов', 'tz' => 'Europe/Saratov'],
    ['region' => 'Ульяновская область', 'city' => 'Ульяновск', 'tz' => 'Europe/Ulyanovsk'],

    // Ural Federal District
    ['region' => 'Курганская область', 'city' => 'Курган', 'tz' => 'Asia/Yekaterinburg'],
    ['region' => 'Свердловская область', 'city' => 'Екатеринбург', 'tz' => 'Asia/Yekaterinburg'],
    ['region' => 'Тюменская область', 'city' => 'Тюмень', 'tz' => 'Asia/Yekaterinburg'],
    ['region' => 'Челябинская область', 'city' => 'Челябинск', 'tz' => 'Asia/Yekaterinburg'],

    // Siberian Federal District
    ['region' => 'Алтайский край', 'city' => 'Барнаул', 'tz' => 'Asia/Barnaul'],
    ['region' => 'Кемеровская область', 'city' => 'Кемерово', 'tz' => 'Asia/Novokuznetsk'],
    ['region' => 'Красноярский край', 'city' => 'Красноярск', 'tz' => 'Asia/Krasnoyarsk'],
    ['region' => 'Новосибирская область', 'city' => 'Новосибирск', 'tz' => 'Asia/Novosibirsk'],
    ['region' => 'Омская область', 'city' => 'Омск', 'tz' => 'Asia/Omsk'],
    ['region' => 'Томская область', 'city' => 'Томск', 'tz' => 'Asia/Tomsk'],
    ['region' => 'Иркутская область', 'city' => 'Иркутск', 'tz' => 'Asia/Irkutsk'],
    ['region' => 'Республика Бурятия', 'city' => 'Улан-Удэ', 'tz' => 'Asia/Irkutsk'],

    // Far Eastern Federal District
    ['region' => 'Республика Саха (Якутия)', 'city' => 'Якутск', 'tz' => 'Asia/Yakutsk'],
    ['region' => 'Забайкальский край', 'city' => 'Чита', 'tz' => 'Asia/Chita'],
    ['region' => 'Амурская область', 'city' => 'Благовещенск', 'tz' => 'Asia/Yakutsk'],
    ['region' => 'Хабаровский край', 'city' => 'Хабаровск', 'tz' => 'Asia/Vladivostok'],
    ['region' => 'Приморский край', 'city' => 'Владивосток', 'tz' => 'Asia/Vladivostok'],
    ['region' => 'Сахалинская область', 'city' => 'Южно-Сахалинск', 'tz' => 'Asia/Sakhalin'],
    ['region' => 'Магаданская область', 'city' => 'Магадан', 'tz' => 'Asia/Magadan'],
    ['region' => 'Камчатский край', 'city' => 'Петропавловск-Камчатский', 'tz' => 'Asia/Kamchatka'],
    ['region' => 'Чукотский автономный округ', 'city' => 'Анадырь', 'tz' => 'Asia/Anadyr'],
];

// Build response with ISO time and offset for each timezone
$nowUtc = new DateTimeImmutable('now', new DateTimeZone('UTC'));

$items = array_map(function ($entry) use ($nowUtc) {
    $tz = $entry['tz'];
    $dt = $nowUtc->setTimezone(new DateTimeZone($tz));
    $offsetMinutes = (int) $dt->getOffset() / 60;
    $sign = $offsetMinutes >= 0 ? '+' : '-';
    $absMinutes = abs($offsetMinutes);
    $hours = floor($absMinutes / 60);
    $minutes = $absMinutes % 60;
    $offsetStr = sprintf('UTC%s%02d:%02d', $sign, $hours, $minutes);
    return [
        'region' => $entry['region'],
        'city' => $entry['city'],
        'timezone' => $tz,
        'offset' => $offsetStr,
        'iso' => $dt->format(DateTimeInterface::ATOM),
    ];
}, $centers);

usort($items, function ($a, $b) {
    if ($a['offset'] === $b['offset']) {
        return strcmp($a['city'], $b['city']);
    }
    return strcmp($a['offset'], $b['offset']);
});

echo json_encode(['items' => $items], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);


