DeezerRec.AutoComplete = function (deezerWrapper, selectCallback) {
    var self = this;

    self.deezerWrapper = deezerWrapper;
    self.selectCallback = selectCallback;

    self.init = function () {
        $("#searchKey").kendoAutoComplete({
            dataTextField: "fullName",
            select: function (e) {
                selectCallback(this.dataItem(e.item.index()).item);
            },
            dataSource: {
                schema: {
                    data: function (response) {
                        var convertedData = [];

                        $.each(response.data, function (i, item) {
                            convertedData.push({ fullName: item.artist.name + ' - ' + item.title, item: item });
                        });

                        return convertedData;
                    }
                },
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        deezerWrapper.searchAlbums(options.data.filter.filters[0].value, function(response) {
                            options.success(response);
                        });
                    }
                }
            }
        });
    }
   
};