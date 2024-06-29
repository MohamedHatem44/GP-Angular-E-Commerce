/*--------------------------------------------------------------------*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../services/product.service';
import { ColorService } from '../../../services/color.service';
import { SizeService } from '../../../services/size.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { BlogService } from '../../../services/blog.service';
import { UserService } from '../../../services/user.service';
import { OrderService } from '../../../services/order.service';
import { MessageService } from '../../../services/message.service';

import { Product } from '../../../models/product';
import { Color } from '../../../models/color';
import { Size } from '../../../models/size';
import { Category } from '../../../models/category';
import { Brand } from '../../../models/brand';
import { Blog } from '../../../models/blog';
import { User } from '../../../models/user';
import { Order } from '../../../models/order';
import { Message } from '../../../models/message';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminMainComponent implements OnInit {
  // Arrays holding data
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  colors: Color[] = [];
  sizes: Size[] = [];
  blogs: Blog[] = [];
  orders: Order[] = [];
  messages: Message[] = [];
  users: User[] = [];

  // Count properties
  productsCount: number = 0;
  categoriesCount: number = 0;
  brandsCount: number = 0;
  colorsCount: number = 0;
  sizesCount: number = 0;
  blogsCount: number = 0;
  ordersCount: number = 0;
  messagesCount: number = 0;
  usersCount: number = 0;

  // Loading flags
  productsLoading: boolean = false;
  categoriesLoading: boolean = false;
  brandsLoading: boolean = false;
  colorsLoading: boolean = false;
  sizeLoading: boolean = false;
  blogsLoading: boolean = false;
  ordersLoading: boolean = false;
  messagesLoading: boolean = false;
  usersLoading: boolean = false;

  // Error messages
  productsError: string | null = null;
  categoriesError: string | null = null;
  brandsError: string | null = null;
  colorsError: string | null = null;
  sizeError: string | null = null;
  blogsError: string | null = null;
  ordersError: string | null = null;
  messagesError: string | null = null;
  usersError: string | null = null;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _ProductService: ProductService,
    private _CategoryService: CategoryService,
    private _BrandService: BrandService,
    private _ColorService: ColorService,
    private _SizeService: SizeService,
    private _BlogService: BlogService,
    private _OrderService: OrderService,
    private _MessageService: MessageService,
    private _UserService: UserService,
    private _Router: Router,
    private _ModalService: NgbModal,
    private _ToastrService: ToastrService
  ) {}
  /*------------------------------------------------------------------*/
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
    this.loadColors();
    this.loadSizes();
    this.loadBlogs();
    this.loadOrders();
    this.loadMessages();
    this.loadUsers();
  }
  /*------------------------------------------------------------------*/
  // Load Products
  loadProducts(): void {
    this.productsLoading = true;
    this._ProductService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.products;
        this.productsCount = this.products.length;
        this.productsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.productsError = 'Failed to load products';
        this.productsLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Categories
  loadCategories(): void {
    this.categoriesLoading = true;
    this._CategoryService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response.categories;
        this.categoriesCount = this.categories.length;
        this.categoriesLoading = false;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.categoriesError = 'Failed to load categories';
        this.categoriesLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Brands
  loadBrands(): void {
    this.brandsLoading = true;
    this._BrandService.getAllBrands().subscribe({
      next: (response: any) => {
        this.brands = response.brands;
        this.brandsCount = this.brands.length;
        this.brandsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load brands', err);
        this.brandsError = 'Failed to load brands';
        this.brandsLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Colors
  loadColors(): void {
    this.colorsLoading = true;
    this._ColorService.getAllColors().subscribe({
      next: (response: any) => {
        this.colors = response.colors;
        this.colorsCount = this.colors.length;
        this.colorsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load colors', err);
        this.colorsError = 'Failed to load colors';
        this.colorsLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Sizes
  loadSizes(): void {
    this.sizeLoading = true;
    this._SizeService.getAllSizes().subscribe({
      next: (response: any) => {
        this.sizes = response.sizes;
        this.sizesCount = this.sizes.length;
        this.sizeLoading = false;
      },
      error: (err) => {
        console.error('Failed to load sizes', err);
        this.sizeError = 'Failed to load sizes';
        this.sizeLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Blogs
  loadBlogs(): void {
    this.blogsLoading = true;
    this._BlogService.getAllBlogs().subscribe({
      next: (response: any) => {
        this.blogs = response.blogs;
        this.blogsCount = this.blogs.length;
        this.blogsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load blogs', err);
        this.blogsError = 'Failed to load blogs';
        this.blogsLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Orders
  loadOrders(): void {
    this.ordersLoading = true;
    this._OrderService.getAllOrders().subscribe({
      next: (response: any) => {
        this.orders = response.orders;
        this.ordersCount = this.orders.length;
        this.ordersLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.ordersError = 'Failed to load orders';
        this.ordersLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Messages
  loadMessages(): void {
    this.messagesLoading = true;
    this._MessageService.getAllMessages().subscribe({
      next: (response: any) => {
        this.messages = response.messages;
        this.messagesCount = this.messages.length;
        this.messagesLoading = false;
      },
      error: (err) => {
        console.error('Failed to load messages', err);
        this.messagesError = 'Failed to load messages';
        this.messagesLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Users
  loadUsers(): void {
    this.usersLoading = true;
    this._UserService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.users;
        this.usersCount = this.users.length;
        this.usersLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.usersError = 'Failed to load users';
        this.usersLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
}
