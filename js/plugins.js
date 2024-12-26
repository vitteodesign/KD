try {
mdLibraries.ItemAdd({
    id: 'marquee',
    js: ['https://static.divhunt.com/assets/library/Marquee.js' ],
});

transform.OnReady(function()
{
    transform.ItemAdd({
        id: 'marquee',
        name: 'Marquee Effect',
        options: {
            a: {'label': 'Duration', 'type': 'INPUT', 'value': '10s', 'units': 's,ms'},
            b: {'label': 'Gap', 'type': 'INPUT', 'value': '20px', 'units': 'px,em'},
            b2: {'label': 'Gap (Mobile)', 'type': 'INPUT', 'value': '', 'units': 'px,em'},
            c: {'label': 'Reverse Direction', 'type': 'TOGGLE', 'value': false},
            d: {'label': 'Pause', 'type': 'TOGGLE', 'value': false},
            e: {'label': 'Pause on hover', 'type': 'TOGGLE', 'value': false},
            f: {'label': 'Vertical Marquee', 'type': 'TOGGLE', 'value': false}, // New field for vertical marquee
        },
        code: function(transform, tag, target, options, data, index)
        {  

            this.init = () => {

                let tagId = tag.Get('id');
                let cls = `.t${tagId}`;
                let marquee_id = `marquee-${tagId}`;
                let duration = options.a;
                $("#"+marquee_id).remove();

                if (options.d) {
                    $(target).css("height", "100%");
                    return;
                }

                let contents = $(target).children();
                $(target).empty().append($('<div>').append(contents));

                if (!duration) {
                    duration = '10';
                }

                let direction = "normal";
                if (options.c) {
                    direction = "reverse";
                }

                if(!duration?.includes("s") && !duration?.includes("ms")) {
                    duration = duration+"s";
                }

                const timesToDuplicate = 5; 

                let increasedDuration = duration.endsWith('ms') ?
                    `${parseInt(duration) * timesToDuplicate}ms` :
                    `${parseInt(duration) * timesToDuplicate}s`;

                let gap = options.b;
               
                if(!gap?.includes("px") && !gap?.includes("em")) {
                    gap = gap+"px";
                }  

                let gapMobile = options.b2 ? options.b2 : gap;
                if(!gapMobile?.includes("px") && !gapMobile?.includes("em")) {
                    gapMobile = gapMobile+"px";
                }

                let style;

                if (options.f) { // Vertical marquee
                    style = `
                        <style id="${marquee_id}">
                            ${cls} {
                                overflow: hidden;
                                position: relative;
                                width: 100%;
                                height: 100%;
                            }

                            ${cls} > div {
                                display: block;
                                position: absolute;
                                gap: ${gap};
                            }

                            @media (max-width: 480px) { 
                                ${cls} > div {
                                    gap: ${gapMobile};
                                }
                            }

                            ${cls} > div {
                                animation: plugin_marquee_vertical ${increasedDuration} linear infinite;
                                animation-direction: ${direction};
                                animation-play-state: running;
                            }

                            ${cls}:hover > div {
                                animation-play-state: ${options.e ? 'paused' : 'running'};
                            }

                           
                        </style>
                    `;
                } else { // Horizontal marquee
                    style = `
                        <style id="${marquee_id}">
                            ${cls} {
                                overflow: hidden;
                                position: relative;
                                width: 100%;
                            }

                            ${cls} > div {
                                display: flex;
                                position: absolute;
                                gap:${gap};
                                width: max-content;
                            }

                            @media (max-width: 480px) { 
                                ${cls} > div {
                                    gap:${gapMobile};
                                }
                            }

                            ${cls} > div {
                                animation: plugin_marquee ${increasedDuration} linear infinite;
                                animation-direction: ${direction};
                                animation-play-state: running;
                            }

                            ${cls}:hover > div {
                                animation-play-state: ${options.e ? 'paused' : 'running'};
                            }


                        </style>
                    `;
                }

                /* DUPLICATE ITEMS & PLAY ANIMATION */
                $(target).find(">div").append(function() { return $(this).find(">*").clone(); });
                $(target).find(">div").append(function() { return $(this).find(">*").clone(); });

                $("style#"+marquee_id).remove();
                $("body").append(style);
            }

            return this.init();
        },
    });
});
} catch (error) { console.log(error); }

