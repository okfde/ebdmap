$(function(){
  var dataset = new recline.Model.Dataset({
    url: '0As2ywI3daTRTdGdJWTUwYzNGYUxkM0ZxSFRQeUpiV1E',
    worksheetIndex: 3,
    backend: 'gdocs'
  });
  // var dataset = new recline.Model.Dataset({
  //   url: 'https://docs.google.com/spreadsheet/ccc?key=0Aon3JiuouxLUdGZPaUZsMjBxeGhfOWRlWm85MmV0UUE#gid=0',
  //   backend: 'gdocs'
  // });
  dataset.fetch().done(function(allDataset) {
    var categories = {};
    allDataset.records.each(function(record) {
      var category = record.get('category');
      if (category) {
        var cats = category.split(',');
        for (var i = 0; i<cats.length; i += 1) {
          categories[cats[i]] = true;
        }
      }
    });
    for (var cat in categories) {
      $('#categories').append('<option value="'+ cat +'">' + cat + '</option>');
    }

    var dataset = new recline.Model.Dataset({
      records: allDataset.records.map(function(x){ return x.toJSON();})
    });


    $('#categories').on('change', function(e){
      var val = $(this).val();
      if (val === '') {
        dataset.records.reset(allDataset.records.map(
          function(x){ return x.toJSON(); }));
        return;
      }
      var filtered = allDataset.records.filter(function(record) {
        return record.get('category').indexOf(val) !== -1;
      });

      dataset.records.reset(_.map(filtered, function(x){ return x.toJSON();}));
    });

    var $el = $('#map');

    var map = new recline.View.Map({
      model: dataset,
    });
    $el.html(map.el);
    map.infobox = function(record) {
      var html = '<h3><a href="' +record.get('url') +'">' + record.get('name') + '</a></h3>'
      html += '<p>'+record.get('city') + ', '+record.get('countrycode')+'</p>';
      return html;
    }
    map.render();
    map.state.set('autoZoom', false);
  });
});