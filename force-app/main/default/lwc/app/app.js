import { LightningElement, api, track } from 'lwc';
import getPages from '@salesforce/apex/scratchbook_cc.getPages';
import savePage from '@salesforce/apex/scratchbook_cc.savePage';
import deletePage from '@salesforce/apex/scratchbook_cc.deletePage';

export default class App extends LightningElement {

    @api height;
    @api width;
    @api page;
    @track pages;
    bookId = 'a005j0000057CczAAE';
    pageStatus = 'Saved';
    pageStatusClass = 'pageStatus';

    connectedCallback(){
        this.page = {};
        this.height = 595;
        this.width = 1275;
        this.loadPages();
    }

    handleOnSave(event){
        this.page = event.detail.page;
        if(!this.page){
            console.log('received null image');
        }
        var params = {};
        params.bookId = this.bookId;
        params.imageData = this.page.imageData;
        if(this.page.pageId)
            params.pageId = this.page.pageId; 
        else
            params.pageId = '';
        // console.log(JSON.stringify(this.page));
        savePage({ requestStructure : JSON.stringify(params)})
            .then(result => {
                this.updateUi();
                console.log('savePage result - ' + result);
                this.template.querySelector('c-sidebar').refreshPages();
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }
    
    handleNavigation(event){
        var action = event.detail.action;
        if(action === 'open'){
            this.template.querySelector('c-board').style.marginLeft = '250px';
            this.template.querySelector('.pageStatus').style.marginLeft = '270px';
        } else {
            this.template.querySelector('.pageStatus').style.marginLeft = '100px';
            this.template.querySelector('c-board').style.marginLeft = '0px';
        }
    }

    handleImageSelected(event){
        var page = event.detail.page;
        this.pageStatus = 'Saved';
        var cmp = this.template.querySelector('c-board');
        cmp.loadImage(page);
    }

    handleImageDelete(event){
        
    }

    handlePageChange(event){
        this.pageStatus = 'Unsaved';
    }

    updateUi(){
        this.pageStatus = 'Saved';
    }
    
    /*side bar functions*/
    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
    openNav() {
        this.template.querySelector(".sidebar").style.width = "250px";
        this.template.querySelector(".main").style.marginLeft = "250px";
    }
    
    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    closeNav() {
        this.template.querySelector(".sidebar").style.width = "0";
        this.template.querySelector(".main").style.marginLeft = "0";
    }

    loadPages(){
        getPages({ bookId : this.bookId })
            .then(result =>{
                this.pages = result;
                // console.log(JSON.stringify(result));
            })
            .catch(error =>{
                console.log(JSON.stringify(error));
            });
    }
    
    handleImageSelect(event){
        var page = event.detail.page;
        console.log('handleImageSelect');
        // dispatchEvent(this, 'imageselected', { page : page });
    }

    handleDeleteClick(event) {
        var page = event.detail.page;
        deletePage({ pageId : page.pageId })
            .then(result => {
                console.log('deletePage result - ' + result);
                this.loadPages();
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }
}