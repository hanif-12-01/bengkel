<?php

class WorkshopController
{
    public function __construct(private Workshop $workshopModel)
    {
    }

    public function index(): void
    {
        successResponse('Berhasil mengambil data bengkel', $this->workshopModel->getAll());
    }
}