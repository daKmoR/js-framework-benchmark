import GrainLitElement from '../node_modules/grain-lit-element/GrainLitElement.js';
import { html } from '../node_modules/lit-html/lib/lit-extended.js';

var startTime;
var lastMeasure;

var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
};
var stopMeasure = function() {
    window.setTimeout(function() {
        var stop = performance.now();
        console.log(lastMeasure+" took "+(stop-startTime));
    }, 0);
};

class MainElement extends GrainLitElement(HTMLElement) {
    static get useShadowDom() { return false; }

    constructor() {
      super();
      this.did = 1; // do not add it as property as changeing properties means rerenders
    }
  
    static get properties() {
      return {
        data: {
          type: Array,
          value: function() { return []; }
        },
        selectedId: {
          type: Number,
          value: -1,
        },
      }
    }
  
    add() {
        startMeasure("add");
        this.data = this.data.concat(this.buildData(1000));
        stopMeasure();
    }
    run() {
        startMeasure("run");
        this.data = this.buildData(1000);
        stopMeasure();
    }
    runLots() {
        startMeasure("runLots");
        this.data = this.buildData(10000);
        stopMeasure();
    }
    clear() {
        startMeasure("clear");
        this.data = [];
        stopMeasure();
    }
    delete(id) {
        const index = this.data.findIndex(item => item.id === id );
        startMeasure("delete");
        this.data.splice(index, 1);
        this.update();
        stopMeasure();
    }
    select(id) {
        startMeasure("select");
        this.selectedId = id;
        stopMeasure();
    }
    swapRows() {
        startMeasure("swapRows");
        if (this.data.length > 10) {
            let tmp = this.data[4];
            this.data[4] = this.data[9];
            this.data[9] = tmp;
            this.update();
        }
        stopMeasure();
    }
    updateData() {
        startMeasure("updateData");
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label = this.data[i].label + ' !!!';
        }
        this.update();
        stopMeasure();
    }
    buildData(count) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({ id: this.did++, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
        }
        return data;
    }
    _random(max) {
        return Math.round(Math.random() * 1000) % max;
    }
      
    render() {
        return html`
            <div class="container" >
                <div class="jumbotron">
                    <div class="row">
                        <div class="col-md-6">
                            <h1>lit-html v0.8.0 as WebComponent</h1>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-sm-6 smallpad">
                                    <button type="button" class="btn btn-primary btn-block" id="run" on-click=${(e) => { this.run(); }}>Create 1,000 rows</button>
                                </div>
                                <div class="col-sm-6 smallpad">
                                    <button type="button" class="btn btn-primary btn-block" id="runlots" on-click="${(e) => { this.runLots(); }}">Create 10,000 rows</button>
                                </div>
                                <div class="col-sm-6 smallpad">
                                    <button type="button" class="btn btn-primary
                                    btn-block" id="add" on-click=${(e) => { this.add(); }}>Append 1,000 rows</button>
                                </div>
                                <div class="col-sm-6 smallpad">
                                    <button type="button" class="btn btn-primary
                                    btn-block" id="update" on-click=${(e) => { this.updateData(); }}>Update every 10th row</button>
                                </div>
                                <div class="col-sm-6 smallpad">
                                    <button type="button" class="btn btn-primary
                                    btn-block" id="clear" on-click=${(e) => { this.clear(); }}>Clear</button>
                                </div>
                                <div class="col-sm-6 smallpad">
                                    <button type="button" class="btn btn-primary
                                    btn-block" id="swaprows" on-click=${(e) => { this.swapRows(); }}>Swap Rows</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table class="table table-hover table-striped test-data">
                    <tbody>
                    ${this.data.map(item => html`
                        <tr class$="${item.id === this.selectedId ? 'danger' : ''}">
                        <td class="col-md-1">${item.id})</td>
                        <td class="col-md-4">
                            <a on-click="${(e) => { this.select(item.id) }}">${item.label}</a>
                        </td>
                        <td class="col-md-1"><a on-click="${(e) => { this.delete(item.id) }}"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                        <td class="col-md-6"></td>
                        </tr>
                    `)}
                    </tbody>
                </table>
                <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
            </div>
        `;
    }
  
}

customElements.define('main-element', MainElement);