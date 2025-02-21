import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PaginatorComponent } from "./paginator.component";

describe('PaginatorComponent', () => {

    let component: PaginatorComponent;
    let fixture: ComponentFixture<PaginatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                PaginatorComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit currentPageChange when goToNextPage is called', () => {
        spyOn(component.currentPageChange, 'emit');
        component.goToNextPage();
        expect(component.currentPageChange.emit).toHaveBeenCalledWith(2);
    });

    it('should emit currentPageChange when goToPreviusPage is called from page 2', () => {
        spyOn(component.currentPageChange, 'emit');
        component.currentPage = 2;
        component.goToPreviousPage();
        expect(component.currentPageChange.emit).toHaveBeenCalledWith(1);
    });

    it ('should not emit currentPageChange when goToNextPage is called at page 1', () => {
        spyOn(component.currentPageChange, 'emit');
        component.currentPage = 1;
        component.goToPreviousPage()
        expect(component.currentPage).toBe(1);
        expect(component.currentPageChange.emit).not.toHaveBeenCalled();
    })

    it('should emit pageSizeChange when setPageSize is called', () => {
        spyOn(component.pageSizeChange, 'emit');
        component.setPageSize(25);
        expect(component.pageSizeChange.emit).toHaveBeenCalledWith(25);
    });


})