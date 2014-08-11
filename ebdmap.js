$(function(){
  var dataset = new recline.Model.Dataset({
    url: '0As2ywI3daTRTdGdJWTUwYzNGYUxkM0ZxSFRQeUpiV1E',
    worksheetIndex: 1,
    backend: 'gdocs'
  });
  var filters = [
    {
      id: 'categories',
      label: 'Categories',
      column: 'category',
      values: ['individual', 'startup', 'small company', 'big company']
    },
    {
      id: 'technicalarea',
      label: 'Technical Area',
      column: 'technicalarea',
      values: ['Data Acquisition','Data Analysis','Data Curation','Data Storage','Data Usage']
    },
    {
      id: 'industrialsector',
      label: 'Industrial Sector',
      column: 'industrialsector',
      values: ['Finance & Insurance Sectors','Health Sector','Manufacturing, Retail, Energy & Transport Sectors','Public Sector','Telco, Media & Entertainment Sectors']
    },
    {
      id: 'country',
      label: 'Country',
      column: 'country'
    }
  ];

  dataset.fetch().done(function(allDataset) {
    _.each(filters, function(filter){
      if (filter.values === undefined) {
        filter.values = _.uniq(allDataset.records.pluck('country'));
      }
    });
    _.each(filters, function(filter){
      _.each(filter.values, function(value){
        $('#' + filter.id).append('<option value="'+ value +'">' + value + '</option>');
      })
    });

    var dataset = new recline.Model.Dataset({
      records: allDataset.records.map(function(x){ return x.toJSON();})
    });

    var applyFilter = function(){
      dataset.records.reset(allDataset.records.map(function(x){ return x.toJSON(); }));
      var filteredRecords = dataset.records.models;
      _.each(filters, function(filter){
        var val = $('#'+filter.id).val();
        if (val === '') { return; }
        filteredRecords = filteredRecords.filter(function(record) {
          return record.get(filter.column).indexOf(val) !== -1;
        });
      });
      dataset.records.reset(_.map(filteredRecords, function(x){
        return x.toJSON();
      }));
    };

    _.each(filters, function(filter){
      $('#' + filter.id).on('change', applyFilter);
    })

    var $el = $('#map');

    var map = new recline.View.Map({
      model: dataset,
    });
    $el.html(map.el);
    map.infobox = function(record) {
      var html = '<h3><a target="_blank" href="' +record.get('url') +'">' + record.get('companyname') + '</a></h3>'
      html += '<p>'+record.get('city') + ', '+record.get('countrycode')+'<br/>';
      html += 'Technical Area: '+record.get('technicalarea') + '<br/>';
      html += 'Industry Sector: '+record.get('industrysector') + '</p>';
      return html;
    }
    map.render();
    map.state.set('autoZoom', false);
  });
});