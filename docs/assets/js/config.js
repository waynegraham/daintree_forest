var config = {
    style: 'mapbox://styles/mapbox/satellite-v9',
    accessToken: 'pk.eyJ1Ijoid3NnNHciLCJhIjoiTVd4cXdScyJ9.ypK9cLCVFReavCn9b_hhWQ',
    showMarkers: false,
    markerColor: '#3FB1CE',
    projection: 'globe',
    //Read more about available projections here
    //https://docs.mapbox.com/mapbox-gl-js/example/projections/
    inset: true,
    theme: 'dark',
    use3dTerrain: true, //set true for enabling 3D maps.
    auto: false,
    title: 'Daintree Forest',
    subtitle: 'A Walk',
    byline: 'By Charles Henry',
    footer: '<a tartget="_blank" href="https://www.clir.org/">CLIR</a>',
    chapters: [
        {
            id: 'globe',
            alignment: 'left',
            hidden: false,
            description: 'Here we are',
            location: {
                center: [-165.47321, 26.40394],
                zoom: 3,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'easeTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [
                // {
                //     layer: 'layer-name',
                //     opacity: 1,
                //     duration: 5000
                // }
            ],
            onChapterExit: [
                // {
                //     layer: 'layer-name',
                //     opacity: 0
                // }
            ]
        },
        {
            id: 'drowsy-light',
            alignment: 'center',
            hidden: false,
            // title: 'Display Title',
            // image: './path/to/image/source.png',
            description: 'A green and drowsy light',
            location: {
                center: [145.17725, -16.33494],
                zoom: 3,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [
                // {
                //     layer: 'layer-name',
                //     opacity: 1,
                //     duration: 5000
                // }
            ],
            onChapterExit: [
                // {
                //     layer: 'layer-name',
                //     opacity: 0
                // }
            ]
        },
        {
            id: 'second-identifier',
            alignment: 'right',
            hidden: false,
            // title: 'Second Title',
            // image: './path/to/image/source.png',
            description: 'How old you think?',
            location: {
                center: [145.17725, -16.33494],
                zoom: 8.5,
                pitch: 60,
                bearing: -43.2,
                // flyTo additional controls-
                // These options control the flight curve, making it move
                // slowly and zoom out almost completely before starting
                // to pan.
                //speed: 2, // make the flying slow
                //curve: 1, // change the speed at which it zooms out
            },
            mapAnimation: 'flyTo',
            rotateAnimation: true,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'cretacious',
            alignment: 'center',
            hidden: false,
            // title: '',
            image: '/daintree/assets/img/cretaceous.jpg',
            description: '<p class="mt-3">This forest&ndash; 120 million years. Protected, so our touch is slight. Look again: mosses springing void our step as if we are not here. </p>',

        },
        {
            id: 'fauna',
            alignment: 'center',
            hidden: false,
            // title: 'Third Title',
            image: '/daintree/assets/marco-marques-dJ_Zl5LpPto-unsplash.jpg',
            description: '<p class="mt-3">Ancestor trees conjured seeds when dinosaurs&ndash;</p>',
            location: {
                center: [145.17725, -16.33494],
                zoom: 15,
                pitch: 68.01,
                bearing: -65
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'birds',
            alignment: 'fully',
            hidden: false,
            // title: 'fourth Title',
            // image: '/daintree/assets/img/leon-andov-f7isN80IXik-unsplash.jpg',
            video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/qSm93-hhZGg?si=3yJsPRAu9EyawGKB&amp;start=151&rel=0&autoplay=1&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
            description: '<p class="mt-3">Yes. Out of time, the yellow robins, fairywrens. Honeyeaters at their promiscuous bloom.</p><p>If we do not act?</p>',
            location: {
                center: [145.17725, -16.33494],
                zoom: 16,
                pitch: 80,
                bearing: -50
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'language',
            alignment: 'fully',
            hidden: false,
            // title: 'fourth Title',
            image: '/daintree/assets/img/zac-porter-tzA9aoQxp_8-unsplash.jpg',
            description: '<p class="mt-3"> Here is a past so deep our mind meanders to an airy thinness where thoughts cannot form, a phantom rustle.</p>',
            location: {
                center: [145.17725, -16.33494],
                zoom: 17,
                pitch: 70,
                bearing: -35
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'chart',
            alignment: 'fully',
            hidden: false,
            // title: 'fourth Title',
            image: '/daintree/assets/img/leon-andov-f7isN80IXik-unsplash.jpg',
            description: '<p class="mt-3">Our choice: this scape may surge and recompass a new world, so warm and damp persistently.  Stand by the ribbonwood, the languorous palm, imagine the quiet roll of eon upon eon come and gone; now look again, identical: the future.</p>',
            chart: 'timeline',
            location: {
                center: [145.17725, -16.33494],
                zoom: 15,
                pitch: 60,
                bearing: -20
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'timeline',
            alignment: 'fully',
            hidden: false,
            // title: 'fourth Title',
            image: '/daintree/assets/img/hamish-weir-q8Jb1md-8k8-unsplash.jpg',
            chart: 'cretaceous',
            description: '<p class="mt-3">You and I a momentary seam and slightest fiction. Before we were and after this is.</p>',
            location: {
                center: [145.17725, -16.33494],
                zoom: 14,
                pitch: 50,
                bearing: -20
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'trail',
            alignment: 'fully',
            hidden: false,
            // title: 'fourth Title',
            image: '/daintree/assets/img/pat-whelen-KaVnAG3BLqc-unsplash.jpg',
            description: '<p class="mt-3">A trail.</p><p>The foot path to Mt. Sorrow. From there the shore, its azure slap primeval, and beneath that fulsome round a bygone adumbration stirs, till human voices wake it, and we drown.</p>',
            location: {
                center: [145.17725, -16.33494],
                zoom: 14,
                pitch: 60,
                bearing: 10
            },
            mapAnimation: 'flyTo',
            rotateAnimation: true,
            callback: '',
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};
