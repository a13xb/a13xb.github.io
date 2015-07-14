function R(from, to) {
    return from + Math.random() * (to - from);
}

function advance(w)
{
    w.flakes = w.flakes.map(function(f) {
        // Animate shit
        f.y += f.vy;
        f.x += f.vx;
        return f;
    }).filter(function(f) {
        // Snowflakes drop off the bottom of the screen
        return f.y < w.h + 50;
    });
    // Replenish with new snowflakes from the top
    var n = w.rows * w.cols - w.flakes.length;
    for (var i = 0; i < n; i++) {
        w.genf(-w.w * 0.2, w.w, 0, 0);
    }
}

function render(c, w)
{
    c.clearRect(0, 0, w.w, w.h);
    w.flakes.forEach(function(f) {
        c.beginPath();
        c.arc(
            f.x, f.y, f.r,
            0, 2 * Math.PI, false
        );
        c.fillStyle = f.c;
        c.fill();
    });
}

function create(width, height)
{
    var w = {
        rows: 7,
        cols: 7,
        fps: 60,
        flakes: [],
        w: width,
        h: height,
        rmin: 3,
        rmax: 8,
        frame: 0,
    };
    w.genf = function(x1, x2, y1, y2) {
        var r = R(w.rmin, w.rmax);
        var p = r / w.rmax; // "perspective"
        var f = {
            r: r,
            c: 'white',
            x: R(x1, x2), vy: R(2.0, 3) * p,
            y: R(y1, y2), vx: R(0.5, 1) * p,
        };
        w.flakes.push(f);
    };

    // populate initial set using a jittered grid
    var wr = w.rows;
    var wc = w.cols;
    for (var r = 0; r < wr; r++) {
        for (var c = 0; c < wc; c++) {
            w.genf(
                (w.w / wc) * c,
                (w.w / wc) * (c + 1),
                (w.h / wr) * r,
                (w.h / wr) * (r + 1)
            );
        }
    }
    return w;
}

function start(w, c)
{
    var f = function() {
        w.frame++;
        advance(w);
        render(c, w);
        w.timer = setTimeout(f, 1000 / w.fps);
    };
    w.timer = setTimeout(f, 0);
}

function stop(w)
{
    clearTimeout(w.timer);
}

var W = {}; // global state
function run()
{
    var canvas = document.getElementById('canvas');
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;
    canvas.width = w;
    canvas.height = h;

    stop(W);
    W = create(w, h);
    start(W, canvas.getContext('2d'));
}
